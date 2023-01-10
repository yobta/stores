/* eslint-disable accessor-pairs */
import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'
import { codecYobta } from '../../util/codecYobta/index.js'
import { broadcastChannelPluginYobta } from './index.js'

const postMessage = vi.fn()
const onmessage = vi.fn()
const close = vi.fn()

const broadcastChannelMock = vi.fn(() => ({
  postMessage,
  set onmessage(listener: any) {
    onmessage(listener)
  },
  close,
}))
vi.stubGlobal('BroadcastChannel', broadcastChannelMock)

let encode = vi.fn()
let decode = vi.fn()

vi.mock('../../util/codecYobta/index.js', () => ({
  codecYobta: {
    encode(state: any, ...overloads: any[]) {
      encode(state, ...overloads)
      return JSON.stringify([state, ...overloads])
    },
    decode(item: string) {
      decode(item)
      return JSON.parse(item)
    },
  },
}))

const params = {
  addMiddleware: vi.fn(),
  next: vi.fn(),
  initialState: 'yobta',
  last: vi.fn(),
}

it('it should add three middlewares', () => {
  broadcastChannelPluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('it should return state when subscribing', () => {
  broadcastChannelPluginYobta({ channel: 'test', codec: codecYobta })(params)
  expect(params.addMiddleware.mock.calls[0][1]('ready')).toBe('ready')
  expect(params.addMiddleware.mock.calls[1][1]('idle')).toBe('idle')
  expect(params.addMiddleware.mock.calls[2][1]('next')).toBe('next')
})

it('it should subscribe on ready state', () => {
  broadcastChannelPluginYobta({ channel: 'test', codec: codecYobta })(params)
  params.addMiddleware.mock.calls[0][1](params.initialState)
  expect(onmessage).toBeCalledTimes(1)
})

it('it should handle next state', () => {
  broadcastChannelPluginYobta({ channel: 'test', codec: codecYobta })(params)
  params.addMiddleware.mock.calls[2][1]('next', 'overload yobta')
  expect(encode).toBeCalledTimes(1)
  expect(encode).toBeCalledWith('next', 'overload yobta')
  expect(postMessage).toBeCalledTimes(1)
  expect(postMessage).toBeCalledWith(JSON.stringify(['next', 'overload yobta']))
})

it('it should mute and unmute postMessage for onmessage', () => {
  broadcastChannelPluginYobta({ channel: 'test', codec: codecYobta })(params)
  params.addMiddleware.mock.calls[0][1]('ready')
  onmessage.mock.calls[0][0]({
    data: JSON.stringify(['next', 'overload yobta']),
  })
  expect(params.next).toBeCalledTimes(1)
  expect(params.next).toBeCalledWith('next', 'overload yobta')
  expect(postMessage).not.toHaveBeenCalled()
  params.addMiddleware.mock.calls[2][1]('next')
  expect(postMessage).not.toHaveBeenCalled()
  params.addMiddleware.mock.calls[2][1]('next')
  expect(postMessage).toHaveBeenCalledOnce()
})
