import { jest } from '@jest/globals'

import { createStore } from '../index.js'

it('has initial state', () => {
  let store = createStore(1)
  expect(store.getState()).toBe(1)
})

it('can set state', () => {
  let store = createStore(1)
  store.setState(2)
  expect(store.getState()).toBe(2)
})

it('is observable', () => {
  let observer = jest.fn()
  let store = createStore(1)
  let unsubscribe = store.add(observer)
  store.setState(2)
  unsubscribe()
  store.setState(3)
  expect(observer).toHaveBeenCalledTimes(1)
})

it('is resetable', () => {
  let observer = jest.fn()
  let store = createStore(1)
  store.add(observer)
  store.setState(2)
  store.reset()
  expect(store.getState()).toBe(1)
  store.setState(3)
  expect(observer).toHaveBeenCalledTimes(1)
})
