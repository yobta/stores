import { jest } from '@jest/globals'

import { observableYobta } from '.'

describe('observableYobta', () => {
  it('has default state', () => {
    let store = observableYobta(1)
    expect(store.last()).toBe(1)
  })

  it('updates state on next', () => {
    let store = observableYobta(1)
    store.next(2)
    let state = store.last()
    expect(state).toBe(2)
  })

  it('notifies observer on next', () => {
    let observer = jest.fn()
    let store = observableYobta(1)
    let unsubscribe = store.observe(observer)
    store.next(() => 1)
    unsubscribe()
    store.next(() => 3)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer.mock.calls[0]).toEqual([1])
  })

  it('has an everload', () => {
    let observer = jest.fn()
    let store = observableYobta(1)
    let unsubscribe = store.observe(observer)
    let overload = Array.from('overload')
    store.next(() => 1, ...overload)
    unsubscribe()
    expect(observer.mock.calls[0]).toEqual([1, ...overload])
  })

  it('keeps state after termination', () => {
    let observer = jest.fn()
    let store = observableYobta(1)
    let unsubscribe = store.observe(observer)
    store.next(() => 1)
    unsubscribe()
    store.next(() => 2)
    expect(store.last()).toBe(2)
  })

  it('does not squash listeners', () => {
    let observer = jest.fn()
    let store = observableYobta(1)
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

  it('calls onStart option when first observer is added', () => {
    let observer = jest.fn()
    let onStart = jest.fn()
    let store = observableYobta(0, { onStart })

    expect(store.last()).toBe(0)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStart).toHaveBeenCalledTimes(0)

    store.next(1)
    expect(store.last()).toBe(1)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStart).toHaveBeenCalledTimes(0)

    let unObserve1 = store.observe(observer)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStart).toHaveBeenCalledTimes(1)

    store.next(2)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledTimes(1)

    let unObserve2 = store.observe(observer)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledTimes(1)

    unObserve1()
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledTimes(1)

    unObserve2()
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledTimes(1)

    store.observe(observer)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledTimes(2)
  })

  it('calls onStop option when last observer is removed', () => {
    let observer = jest.fn()
    let onStop = jest.fn()
    let store = observableYobta(0, { onStop })

    expect(store.last()).toBe(0)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStop).toHaveBeenCalledTimes(0)

    store.next(1)
    expect(store.last()).toBe(1)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStop).toHaveBeenCalledTimes(0)

    let unObserve1 = store.observe(observer)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(onStop).toHaveBeenCalledTimes(0)

    store.next(2)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(0)

    let unObserve2 = store.observe(observer)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(0)

    unObserve1()
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(0)

    unObserve2()
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(1)

    store.observe(observer)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
