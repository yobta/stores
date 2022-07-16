import { expect, vi, it } from 'vitest'

import { observableYobta } from './index.js'

const pluginMock = vi.fn()
const observerMock = vi.fn()

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
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'NEXT',
    last: expect.any(Function),
    next: expect.any(Function),
  })
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
  expect(pluginMock).toHaveBeenCalledTimes(3)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'IDLE',
    last: expect.any(Function),
    next: expect.any(Function),
  })
})

it('does not sends IDLE plugins when has more observer is removed', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  let unsubscribe2 = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(2)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'READY',
    last: expect.any(Function),
    next: expect.any(Function),
  })
  unsubscribe2()
})

it('sends READY event to plugins when observer is added', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  expect(pluginMock).toHaveBeenCalledTimes(2)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'READY',
    last: expect.any(Function),
    next: expect.any(Function),
  })
  unsubscribe()
})

it('sends NEXT event to plugins and observers', () => {
  let store = observableYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(3)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'NEXT',
    last: expect.any(Function),
    next: expect.any(Function),
  })
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

it('sends overloads to plugins', () => {
  let store = observableYobta(1, pluginMock)
  let overload = Array.from('overload')
  store.next(() => 1, ...overload)
  expect(pluginMock).toHaveBeenCalledWith(
    {
      initialState: 1,
      type: 'NEXT',
      last: expect.any(Function),
      next: expect.any(Function),
    },
    ...overload,
  )
})

it('prevents NEXT from bubbling', () => {
  let store = observableYobta(1, pluginMock, ({ next }) => {
    next(last => last * last)
  })
  store.next(2)
  expect(store.last()).toBe(4)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'NEXT',
    last: expect.any(Function),
    next: expect.any(Function),
  })
  store.next(4)
  expect(store.last()).toBe(16)
  expect(pluginMock).toHaveBeenCalledTimes(2)
  expect(pluginMock).toHaveBeenCalledWith({
    initialState: 1,
    type: 'NEXT',
    last: expect.any(Function),
    next: expect.any(Function),
  })
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
