import { jest } from '@jest/globals'

import { observableYobta } from './index.js'

describe('observableYobta', () => {
  let listener = jest.fn()
  let observer = jest.fn()

  it('has default state', () => {
    let store = observableYobta(1, listener)
    expect(store.last()).toBe(1)
    expect(listener).toHaveBeenCalledTimes(0)
    expect(observer).toHaveBeenCalledTimes(0)
  })

  it('sets next state and notifies listeners and observers', () => {
    let store = observableYobta(1, listener)
    expect(store.last()).toBe(1)

    store.next(2)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith({
      initialState: 1,
      type: 'NEXT',
      last: expect.any(Function),
      next: expect.any(Function),
    })

    let unobserve = store.observe(observer)
    expect(store.last()).toBe(2)
    expect(observer).toHaveBeenCalledTimes(0)
    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenLastCalledWith({
      initialState: 1,
      type: 'START',
      last: expect.any(Function),
      next: expect.any(Function),
    })

    store.next(() => 3)
    expect(store.last()).toBe(3)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith(3)
    expect(listener).toHaveBeenCalledTimes(3)
    expect(listener).toHaveBeenLastCalledWith({
      initialState: 1,
      type: 'NEXT',
      last: expect.any(Function),
      next: expect.any(Function),
    })

    unobserve()
    expect(store.last()).toBe(3)
    expect(observer).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledTimes(4)
    expect(listener).toHaveBeenLastCalledWith({
      initialState: 1,
      type: 'STOP',
      last: expect.any(Function),
      next: expect.any(Function),
    })
  })

  it('has overload', () => {
    let store = observableYobta(1)
    let unsubscribe = store.observe(observer)
    let overload = Array.from('overload')
    store.next(() => 1, ...overload)
    unsubscribe()
    expect(observer.mock.calls[0]).toEqual([1, ...overload])
  })

  it('keeps state after termination', () => {
    let store = observableYobta(1)
    let unsubscribe = store.observe(observer)
    store.next(() => 1)
    unsubscribe()
    store.next(() => 2)
    expect(store.last()).toBe(2)
  })

  it('does not squash observers', () => {
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
})
