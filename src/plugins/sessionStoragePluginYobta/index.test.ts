import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'
import { codecYobta, YobtaGenericCodec } from '../../util/codecYobta/index.js'
import { sessionStoragePluginYobta } from './index.js'

let defaultItem = JSON.stringify(['stored yobta'])
let item: string | null = defaultItem
let getItem = vi.fn()
let setItem = vi.fn()
vi.stubGlobal('sessionStorage', {
  getItem(key: string) {
    getItem(key)
    return item
  },
  setItem,
})

let encode = vi.fn()
let decode = vi.fn()

vi.mock('../../util/codecYobta/index.js', () => ({
  codecYobta: {
    encode(state, ...overloads) {
      encode(state)
      return JSON.stringify([state, ...overloads])
    },
    decode(value: string, fallback: () => any) {
      decode(value)
      try {
        return JSON.parse(value || '')
      } catch (error) {
        return [fallback()]
      }
    },
  } as YobtaGenericCodec<any>,
}))

const params = {
  addMiddleware: vi.fn(),
  next: vi.fn(),
  last: vi.fn(),
  initialState: 'yobta',
}

beforeEach(() => {
  item = defaultItem
})

it('Tests middleware addition for sessionStoragePluginYobta', () => {
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('Tests that sessionStoragePluginYobta has no side effects when created', () => {
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(getItem).not.toBeCalled()
  expect(setItem).not.toBeCalled()
  expect(encode).not.toBeCalled()
  expect(decode).not.toBeCalled()
})

it('Tests recovery of state from session storage in sessionStoragePluginYobta', () => {
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')
  expect(state).toEqual('stored yobta')

  expect(decode).toHaveBeenCalledTimes(1)
  expect(decode).toHaveBeenCalledWith(defaultItem)
  expect(encode).not.toBeCalled()

  expect(getItem).toBeCalledTimes(1)
  expect(getItem).toBeCalledWith('test')
  expect(setItem).not.toBeCalled()
})

it('Tests default to initial state when no session is stored in sessionStoragePluginYobta', () => {
  item = null
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')
  expect(decode).toBeCalledWith(null)
  expect(state).toBe('ready')
  expect(getItem).toBeCalledWith('test')
  expect(setItem).not.toBeCalled()
})

it('Tests handling of idle state in sessionStoragePluginYobta', () => {
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[1][1]('idle')

  expect(encode).toBeCalledTimes(1)
  expect(encode).toBeCalledWith('idle')
  expect(decode).not.toBeCalled()

  expect(setItem).toBeCalledTimes(1)
  expect(setItem).toBeCalledWith('test', JSON.stringify(['idle']))
  expect(getItem).not.toBeCalled()

  expect(state).toEqual('idle')
})

it('Tests handling of next state in sessionStoragePluginYobta', () => {
  sessionStoragePluginYobta({ channel: 'test', codec: codecYobta })(params)
  let state = params.addMiddleware.mock.calls[1][1]('next')

  expect(encode).toBeCalledTimes(1)
  expect(encode).toBeCalledWith('next')
  expect(decode).not.toBeCalled()

  expect(setItem).toBeCalledTimes(1)
  expect(setItem).toBeCalledWith('test', JSON.stringify(['next']))
  expect(getItem).not.toBeCalled()

  expect(state).toEqual('next')
})
