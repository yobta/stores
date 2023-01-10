import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'
import { codecYobta, YobtaGenericCodec } from '../../util/codecYobta/index.js'
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
  last: vi.fn(),
  initialState: 'yobta',
}

let encode = vi.fn()
let decode = vi.fn()
let fallbackMock = vi.fn()

vi.mock('../../util/codecYobta/index.js', () => ({
  codecYobta: {
    encode(state: any, ...overloads: any[]) {
      let args = [state, ...overloads]
      encode(...args)
      return JSON.stringify(args)
    },
    decode(value: string, fallback: () => any) {
      decode(value, fallback)
      try {
        return JSON.parse(value || '')
      } catch (error) {
        fallbackMock()
        return [fallback()]
      }
    },
  } as YobtaGenericCodec<any>,
}))

beforeEach(() => {
  item = defaultItem
})

it('adds middleware to store', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('does not add listeners on initialization', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(windowMock.addEventListener).not.toBeCalled()
  expect(windowMock.removeEventListener).not.toBeCalled()
  expect(lsMock.setItem).not.toBeCalled()
  expect(getItem).not.toBeCalled()
})

it('adds listeners on YOBTA_READY event', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)

  params.addMiddleware.mock.calls[0][1]('ready')

  expect(windowMock.addEventListener).toBeCalledTimes(1)
  expect(windowMock.removeEventListener).not.toBeCalled()
})

it('decodes stored value on YOBTA_READY event', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(decode).toBeCalledTimes(1)
  expect(decode).toHaveBeenCalledWith(defaultItem, expect.any(Function))
  expect(state).toBe('stored yobta')
})

it('returns initial state on YOBTA_READY event when no stored value', () => {
  item = null
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(state).toBe('ready')
  expect(decode).toHaveBeenCalledOnce()
  expect(decode).toHaveBeenCalledWith(null, expect.any(Function))
})

it('emoves listeners on YOBTA_IDLE event', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[1][1]('idle')

  expect(encode).toHaveBeenCalledWith('idle')
  expect(lsMock.setItem).toHaveBeenCalledWith('test', JSON.stringify(['idle']))
  expect(windowMock.removeEventListener).toHaveBeenCalledWith(
    'storage',
    expect.any(Function),
  )
  expect(state).toBe('idle')
})

it('encodes and stores state on YOBTA_NEXT event', () => {
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[2][1]('next', 'overload')

  expect(encode).toHaveBeenCalledWith('next', 'overload')
  expect(lsMock.setItem).toHaveBeenCalledWith(
    'test',
    JSON.stringify(['next', 'overload']),
  )
  expect(state).toBe('next')
})

it('handles onMessage event', () => {
  item = null
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  params.addMiddleware.mock.calls[0][1]('ready')

  windowMock.addEventListener.mock.calls[0][1]({
    key: 'test',
    newValue: JSON.stringify(['yobta', 'overload']),
  })

  expect(decode).toBeCalledTimes(2)
  expect(decode).toHaveBeenCalledWith(null, expect.any(Function))
  expect(decode).toHaveBeenCalledWith(
    JSON.stringify(['yobta', 'overload']),
    expect.any(Function),
  )
  expect(params.next).toBeCalledWith('yobta', 'overload')
})

it('ignores onMessage event when channel is incorrect', () => {
  item = null
  localStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  params.addMiddleware.mock.calls[0][1]('ready')

  windowMock.addEventListener.mock.calls[0][1]({
    key: 'wrong-yobta',
    newValue: JSON.stringify(['yobta', 'overload']),
  })

  expect(decode).toBeCalledTimes(1)
  expect(decode).toBeCalledWith(null, expect.any(Function))
  expect(params.next).not.toBeCalled()
})
