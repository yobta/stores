import { expect, vi, it } from 'vitest'

import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  storeYobta,
  YOBTA_READY,
  StoreEvent,
  StoreMiddleware,
} from './index.js'

const pluginMock = vi.fn()
const observerMock = vi.fn()
const observerMock1 = vi.fn()

let addMiddlewareSpy = vi.fn<[StoreEvent, StoreMiddleware<number>], void>()

let handlersSpy = {
  [YOBTA_IDLE]: vi.fn(),
  [YOBTA_READY]: vi.fn(),
  [YOBTA_NEXT]: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  addMiddlewareSpy.mockImplementation((type, handler) => {
    handlersSpy[type].mockImplementation(handler)
  })
  pluginMock.mockImplementation(({ addMiddleware }) => {
    addMiddleware(
      YOBTA_READY,
      handlersSpy[YOBTA_READY].mockImplementation(state => state),
    )
    addMiddleware(
      YOBTA_NEXT,
      handlersSpy[YOBTA_NEXT].mockImplementation(state => state),
    )
    addMiddleware(
      YOBTA_IDLE,
      handlersSpy[YOBTA_IDLE].mockImplementation(state => state),
    )
  })
})

it('has default state', () => {
  let store = storeYobta(1, pluginMock)
  expect(store.last()).toBe(1)
})

it('allows state change when not observed', () => {
  let store = storeYobta(1, pluginMock)
  store.next(2)
  expect(store.last()).toBe(2)
})

it('sends NEXT event to plugins when not observed', () => {
  let store = storeYobta(1, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
})

it('notifies as many plugins as it has', () => {
  let store = storeYobta(1, pluginMock, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(2)
})

it('does no notify observer when it is added', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  expect(observerMock).toHaveBeenCalledTimes(0)
  unsubscribe()
})

it('does no notify observer when it is removed', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
})

it('sends IDLE plugins when last observer is removed', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledWith(1)
})

it('does not emit IDLE when has observers', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  let unsubscribe2 = store.observe(observerMock1)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledTimes(0)
  unsubscribe2()
})

it('sends READY event to plugins when observer is added', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_READY]).toHaveBeenCalledWith(1)
  unsubscribe()
})

it('sends NEXT event to plugins and observers', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  expect(observerMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('sends overloads to observers', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  let overload = Array.from('overload')
  store.next(() => 1, ...overload)
  unsubscribe()
})

it('keeps state after termination', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  store.next(() => 1)
  unsubscribe()
  store.next(() => 2)
  expect(store.last()).toBe(2)
})

it('has unique observers', () => {
  let store = storeYobta(1)
  let terminate1 = store.observe(observerMock)
  let terminate2 = store.observe(observerMock)
  store.next(() => 1)
  expect(observerMock).toHaveBeenCalledTimes(1)
  terminate1()
  store.next(() => 2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  terminate2()
  store.next(() => 3)
  expect(observerMock).toHaveBeenCalledTimes(1)
})
