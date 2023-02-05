import { YOBTA_IDLE, YOBTA_READY } from '../../stores/createStore/index.js'
import { storeEffectYobta } from './index.js'

const onMock = vi.fn()
const offMock = vi.fn()
const mockStore = vi.fn(() => ({
  on(...args: any[]) {
    onMock(...args)
    return offMock
  },
}))

it('returns a function', () => {
  let result = storeEffectYobta(mockStore(), vi.fn())
  expect(result).toEqual(expect.any(Function))
})

it('subscribes to YOBTA_READY when called', () => {
  let store = mockStore()
  storeEffectYobta(store, vi.fn())
  expect(onMock).toHaveBeenCalledWith(YOBTA_READY, expect.any(Function))
})

it('calls the callback and subscribes to YOBTA_IDLE when ready', () => {
  let store = mockStore()
  let callback = vi.fn().mockImplementation(() => vi.fn())
  storeEffectYobta(store, callback)
  let ready = onMock.mock.calls[0][1]
  ready(1)
  expect(onMock).toHaveBeenCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(callback).toHaveBeenCalledWith(1)
})

it('unsubscribes from YOBTA_READY', () => {
  let store = mockStore()
  let stopEffect = storeEffectYobta(store, vi.fn())
  expect(offMock).toHaveBeenCalledTimes(0)
  stopEffect()
  expect(offMock).toHaveBeenCalledTimes(1)
})

it('unsubscribes from YOBTA_IDLE', () => {
  let store = mockStore()
  let stopEffect = storeEffectYobta(store, vi.fn())
  expect(offMock).toHaveBeenCalledTimes(0)
  let ready = onMock.mock.calls[0][1]
  ready(1)
  stopEffect()
  expect(offMock).toHaveBeenCalledTimes(2)
})
