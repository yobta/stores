import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'
import { YobtaEncoder } from '../../util/encoderYobta/index.js'
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

vi.mock('../../util/encoderYobta/index.js', () => ({
  encoderYobta: {
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
  } as YobtaEncoder,
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

it('adds middleware', () => {
  sessionStoragePluginYobta({ channel: 'test' })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('has no side effects when created', () => {
  sessionStoragePluginYobta({ channel: 'test' })(params)
  expect(getItem).not.toBeCalled()
  expect(setItem).not.toBeCalled()
  expect(encode).not.toBeCalled()
  expect(decode).not.toBeCalled()
})

it('recovers state from sessions storage', () => {
  sessionStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')
  expect(state).toEqual('stored yobta')

  expect(decode).toHaveBeenCalledTimes(1)
  expect(decode).toHaveBeenCalledWith(defaultItem)
  expect(encode).not.toBeCalled()

  expect(getItem).toBeCalledTimes(1)
  expect(getItem).toBeCalledWith('test')
  expect(setItem).not.toBeCalled()
})

it('defaults to initial state when no session is stored', () => {
  item = null
  sessionStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[0][1]('ready')
  expect(decode).toBeCalledWith(null)
  expect(state).toBe('ready')
  expect(getItem).toBeCalledWith('test')
  expect(setItem).not.toBeCalled()
})

it('handles idle', () => {
  sessionStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[1][1]('idle')

  expect(encode).toBeCalledTimes(1)
  expect(encode).toBeCalledWith('idle')
  expect(decode).not.toBeCalled()

  expect(setItem).toBeCalledTimes(1)
  expect(setItem).toBeCalledWith('test', JSON.stringify(['idle']))
  expect(getItem).not.toBeCalled()

  expect(state).toEqual('idle')
})

it('handles next', () => {
  sessionStoragePluginYobta({ channel: 'test' })(params)
  let state = params.addMiddleware.mock.calls[1][1]('next')

  expect(encode).toBeCalledTimes(1)
  expect(encode).toBeCalledWith('next')
  expect(decode).not.toBeCalled()

  expect(setItem).toBeCalledTimes(1)
  expect(setItem).toBeCalledWith('test', JSON.stringify(['next']))
  expect(getItem).not.toBeCalled()

  expect(state).toEqual('next')
})
