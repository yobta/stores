import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/createStore/index.js'
import { jsonCodec, YobtaGenericCodec } from '../../util/jsonCodec/index.js'
import { localStoragePlugin } from './index.js'

const defaultItem = JSON.stringify(['stored yobta'])
let item: string | null = null

const getItem = vi.fn()

const lsMock = {
  getItem: (key: string) => {
    getItem(key)
    return item
  },
  setItem: vi.fn(),
}

vi.stubGlobal('localStorage', lsMock)

const windowMock = {
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

const encode = vi.fn()
const decode = vi.fn()
const fallbackMock = vi.fn()

vi.mock('../../util/jsonCodec/index.js', () => ({
  jsonCodec: {
    encode(state: any, ...overloads: any[]) {
      const args = [state, ...overloads]
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
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('does not add listeners on initialization', () => {
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  expect(windowMock.addEventListener).not.toBeCalled()
  expect(windowMock.removeEventListener).not.toBeCalled()
  expect(lsMock.setItem).not.toBeCalled()
  expect(getItem).not.toBeCalled()
})

it('adds listeners on YOBTA_READY event', () => {
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)

  params.addMiddleware.mock.calls[0][1]('ready')

  expect(windowMock.addEventListener).toBeCalledTimes(1)
  expect(windowMock.removeEventListener).not.toBeCalled()
})

it('decodes stored value on YOBTA_READY event', () => {
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  const state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(decode).toBeCalledTimes(1)
  expect(decode).toHaveBeenCalledWith(defaultItem, expect.any(Function))
  expect(state).toBe('stored yobta')
})

it('returns initial state on YOBTA_READY event when no stored value', () => {
  item = null
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  const state = params.addMiddleware.mock.calls[0][1]('ready')

  expect(state).toBe('ready')
  expect(decode).toHaveBeenCalledOnce()
  expect(decode).toHaveBeenCalledWith(null, expect.any(Function))
})

it('emoves listeners on YOBTA_IDLE event', () => {
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  const state = params.addMiddleware.mock.calls[1][1]('idle')

  expect(encode).toHaveBeenCalledWith('idle')
  expect(lsMock.setItem).toHaveBeenCalledWith('test', JSON.stringify(['idle']))
  expect(windowMock.removeEventListener).toHaveBeenCalledWith(
    'storage',
    expect.any(Function),
  )
  expect(state).toBe('idle')
})

it('encodes and stores state on YOBTA_NEXT event', () => {
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  const state = params.addMiddleware.mock.calls[2][1]('next', 'overload')

  expect(encode).toHaveBeenCalledWith('next', 'overload')
  expect(lsMock.setItem).toHaveBeenCalledWith(
    'test',
    JSON.stringify(['next', 'overload']),
  )
  expect(state).toBe('next')
})

it('handles onMessage event', () => {
  item = null
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
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
  localStoragePlugin({ channel: 'test', codec: jsonCodec })(params)
  params.addMiddleware.mock.calls[0][1]('ready')

  windowMock.addEventListener.mock.calls[0][1]({
    key: 'wrong-yobta',
    newValue: JSON.stringify(['yobta', 'overload']),
  })

  expect(decode).toBeCalledTimes(1)
  expect(decode).toBeCalledWith(null, expect.any(Function))
  expect(params.next).not.toBeCalled()
})
