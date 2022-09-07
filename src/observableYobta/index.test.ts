import { expect, vi, it } from 'vitest'

import {
  IDLE,
  INIT,
  NEXT,
  observableYobta,
  READY,
  StoreEvent,
  StoreMiddleware,
} from './index.js'

const pluginMock = vi.fn()
const observerMock = vi.fn()

let addMiddlewareSpy = vi.fn<[StoreEvent, StoreMiddleware<number>], void>()

let handlersSpy = {
  [INIT]: vi.fn(),
  [IDLE]: vi.fn(),
  [READY]: vi.fn(),
  [NEXT]: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  addMiddlewareSpy.mockImplementation((type, handler) => {
    handlersSpy[type].mockImplementation(handler)
  })
  pluginMock.mockImplementation(({ addMiddleware }) => {
    addMiddleware(
      INIT,
      handlersSpy[INIT].mockImplementation(state => state),
    )
    addMiddleware(
      READY,
      handlersSpy[READY].mockImplementation(state => state),
    )
    addMiddleware(
      NEXT,
      handlersSpy[NEXT].mockImplementation(state => state),
    )
    addMiddleware(
      IDLE,
      handlersSpy[IDLE].mockImplementation(state => state),
    )
  })
})

it('has default state', () => {
  let store = observableYobta(1, pluginMock)
  expect(store.last()).toBe(1)
})

it('allows state change when not observed', () => {
  let store = observableYobta(1, pluginMock)
  store.next(2)
  expect(store.last()).toBe(2)
})

it('sends NEXT event to plugins when not observed', () => {
  let store = observableYobta(1, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[NEXT]).toHaveBeenCalledWith(2)
})

it('notifies as many plugins as it has', () => {
  let store = observableYobta(1, pluginMock, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(2)
})

it('does no notify observer when it is added', () => {
  let store = observableYobta(1)
  let unsubscribe = store.observe(observerMock)
  expect(observerMock).toHaveBeenCalledTimes(0)
  unsubscribe()
})

it('does no notify observer when it is removed', () => {
  let store = observableYobta(1)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
})

it('sends IDLE plugins when last observer is removed', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[IDLE]).toHaveBeenCalledWith(1)
})

it('does not sends IDLE plugins when has more observer is removed', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  let unsubscribe2 = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[IDLE]).toHaveBeenCalledTimes(0)
  unsubscribe2()
})

it('sends READY event to plugins when observer is added', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[READY]).toHaveBeenCalledWith(1)
  unsubscribe()
})

it('sends NEXT event to plugins and observers', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[NEXT]).toHaveBeenCalledWith(2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  expect(observerMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('sends overloads to observers', () => {
  let store = observableYobta(1)
  let unsubscribe = store.observe(observerMock)
  let overload = Array.from('overload')
  store.next(() => 1, ...overload)
  unsubscribe()
})

it('keeps state after termination', () => {
  let store = observableYobta(1)
  let unsubscribe = store.observe(observerMock)
  store.next(() => 1)
  unsubscribe()
  store.next(() => 2)
  expect(store.last()).toBe(2)
})

it('does not squash observers', () => {
  let store = observableYobta(1)
  let terminate1 = store.observe(observerMock)
  let terminate2 = store.observe(observerMock)
  store.next(() => 1)
  expect(observerMock).toHaveBeenCalledTimes(2)
  terminate1()
  store.next(() => 2)
  expect(observerMock).toHaveBeenCalledTimes(3)
  terminate2()
  store.next(() => 3)
  expect(observerMock).toHaveBeenCalledTimes(3)
})
