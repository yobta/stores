import { jest } from '@jest/globals'

import { createStore } from '../index.js'

it('creates', () => {
  let store = createStore(1)
  let state = store.last()
  expect(state).toBe(1)
})

it('updates', () => {
  let store = createStore(1)
  store.next(2)
  let state = store.last()
  expect(state).toBe(2)
})

it('notifies', () => {
  let observer = jest.fn()
  let store = createStore(1)
  let unsubscribe = store.observe(observer)
  store.next(1, 2)
  unsubscribe()
  store.next(3, 4, 5)
  expect(observer.mock.calls[0]).toEqual([1, 2])
})

it('resets', () => {
  let observer = jest.fn()
  let store = createStore(1)
  store.observe(observer)
  store.next(1)
  store.reset()
  expect(observer).toHaveBeenCalledTimes(1)
  store.next(2)
  expect(observer).toHaveBeenCalledTimes(1)
})
