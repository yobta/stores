import { jest } from '@jest/globals'

import { observableYobta } from '.'

describe('observableYobta (singleton)', () => {
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
})

describe('observableYobta (lazy)', () => {
  let args = {
    init: () => 1,
    terminate: () => {},
  }
  it('takes initial state as a value', () => {
    let store = observableYobta(() => 0)
    expect(store.last()).toBe(0)
  })
  it('takes initial state as a function', () => {
    let store = observableYobta(() => 0)
    expect(store.last()).toBe(0)
  })
  it('keeps state when observed and flushes when unobserved', () => {
    let store = observableYobta(() => 0)
    let observer = jest.fn()
    let terminate = store.observe(observer)
    store.next(1)
    expect(store.last()).toBe(1)
    terminate()
    expect(store.last()).toBe(0)
  })
  it('does not keep state when not observed', () => {
    let store = observableYobta(() => 0)
    store.next(() => 2)
    expect(store.last()).toBe(0)
  })
  it('calls initializers at right moments', () => {
    jest.spyOn(args, 'init')
    jest.spyOn(args, 'terminate')

    let observer1 = jest.fn()
    let observer2 = jest.fn()

    let store = observableYobta(args.init, args.terminate)
    let unsubscribe1 = store.observe(observer1)

    expect(args.init).toHaveBeenCalledTimes(1)
    expect(args.terminate).toHaveBeenCalledTimes(0)

    let unsubscribe2 = store.observe(observer2)

    expect(args.init).toHaveBeenCalledTimes(1)
    expect(args.terminate).toHaveBeenCalledTimes(0)

    unsubscribe1()

    expect(args.init).toHaveBeenCalledTimes(1)
    expect(args.terminate).toHaveBeenCalledTimes(0)

    unsubscribe2()

    expect(args.init).toHaveBeenCalledTimes(1)
    expect(args.terminate).toHaveBeenCalledTimes(1)
  })
})
