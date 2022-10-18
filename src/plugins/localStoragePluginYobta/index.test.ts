import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/observableYobta/index.js'
import { localStoragePluginYobta } from './index.js'

let defaultItem = JSON.stringify(['stored yobta'])
let item: string | null = null

let getItem = vi.fn()

let lsMock = {
  getItem: (key: string) => {
    getItem(key)
    return item
  },
  setItem: vi.fn(),
}

vi.stubGlobal('localStorage', lsMock)

let windowMock = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

vi.stubGlobal('window', windowMock)

const params = {
  addMiddleware: vi.fn(),
  next: vi.fn(),
  initialState: 'yobta',
}

let encode = vi.fn()
let decode = vi.fn()

vi.mock('../../util/encoderYobta/index.js', () => ({
  encoderYobta: {
    encode(args: any[]) {
      encode(args)
      return JSON.stringify(args)
    },
    decode(value: string) {
      decode(value)
      return JSON.parse(value)
    },
  },
}))

beforeEach(() => {
  item = defaultItem
})

it('adds middleware', () => {
  localStoragePluginYobta({ channel: 'test' })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('does not add liteners when created', () => {
  localStoragePluginYobta({ channel: 'test' })(params)
  expect(windowMock.addEventListener).not.toBeCalled()
  expect(windowMock.removeEventListener).not.toBeCalled()
  expect(lsMock.setItem).not.toBeCalled()
  expect(getItem).not.toBeCalled()
})

it('adds ls listener on ready', () => {
  localStoragePluginYobta({ channel: 'test' })(params)

  params.addMiddleware.mock.calls[0][1]('ready')

  expect(windowMock.addEventListener).toBeCalledTimes(1)
  expect(windowMock.removeEventListener).not.toBeCalled()
})

it('reads decodes and returnes stored value on ready', () => {
  localStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(decode).toBeCalledTimes(1)
  expect(decode).toHaveBeenCalledWith(defaultItem)
  expect(state).toBe('stored yobta')
})

it('reads returnes initial state on ready when there is no stored value', () => {
  item = null
  localStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(decode).not.toBeCalled()
  expect(state).toBe('ready')
})

it('handles idle', () => {
  localStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[1][1]('idle')

  expect(encode).toHaveBeenCalledWith(['idle'])
  expect(lsMock.setItem).toHaveBeenCalledWith('test', JSON.stringify(['idle']))
  expect(windowMock.removeEventListener).toHaveBeenCalledWith(
    'storage',
    expect.any(Function),
  )
  expect(state).toBe('idle')
})

it('handles next', () => {
  localStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[2][1]('next', 'overload')

  expect(encode).toHaveBeenCalledWith(['next', 'overload'])
  expect(lsMock.setItem).toHaveBeenCalledWith(
    'test',
    JSON.stringify(['next', 'overload']),
  )
  expect(state).toBe('next')
})

it('handles onMessage', () => {
  item = null
  localStoragePluginYobta({ channel: 'test' })(params)
  params.addMiddleware.mock.calls[0][1]('ready')

  windowMock.addEventListener.mock.calls[0][1]({
    key: 'test',
    newValue: JSON.stringify(['yobta', 'overload']),
  })

  expect(decode).toBeCalledTimes(1)
  expect(params.next).toBeCalledWith('yobta', 'overload')
})

it('ingnores onMessage when channel is wrong', () => {
  item = null
  localStoragePluginYobta({ channel: 'test' })(params)
  params.addMiddleware.mock.calls[0][1]('ready')

  windowMock.addEventListener.mock.calls[0][1]({
    key: 'wrong-yobta',
    newValue: JSON.stringify(['yobta', 'overload']),
  })

  expect(decode).toBeCalledTimes(0)
  expect(params.next).not.toBeCalled()
})
