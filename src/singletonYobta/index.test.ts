import { jest } from '@jest/globals'

import { singletonYobta } from '.'

describe('singletonYobta', () => {
  it('has default state', () => {
    let store = singletonYobta(1)
    expect(store.last()).toBe(1)
  })

  it('updates state on next', () => {
    let store = singletonYobta(1)
    store.next(2)
    let state = store.last()
    expect(state).toBe(2)
  })

  it('notifies observer on next', () => {
    let observer = jest.fn()
    let store = singletonYobta(1)
    let unsubscribe = store.observe(observer)
    store.next(() => 1)
    unsubscribe()
    store.next(() => 3)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer.mock.calls[0]).toEqual([1])
  })

  it('has an everload', () => {
    let observer = jest.fn()
    let store = singletonYobta(1)
    let unsubscribe = store.observe(observer)
    let overload = Array.from('overload')
    store.next(() => 1, ...overload)
    unsubscribe()
    expect(observer.mock.calls[0]).toEqual([1, ...overload])
  })

  it('keeps state after termination', () => {
    let observer = jest.fn()
    let store = singletonYobta(1)
    let unsubscribe = store.observe(observer)
    store.next(() => 1)
    unsubscribe()
    store.next(() => 2)
    expect(store.last()).toBe(2)
  })

  it('does not squash listeners', () => {
    let observer = jest.fn()
    let store = singletonYobta(1)
    let terminate1 = store.observe(observer)
    let terminate2 = store.observe(observer)
    store.next(() => 1)
    expect(observer).toHaveBeenCalledTimes(2)
    terminate1()
    store.next(() => 2)
    expect(observer).toHaveBeenCalledTimes(3)
    terminate2()
    store.next(() => 3)
    expect(observer).toHaveBeenCalledTimes(3)
  })
})
