import { jest } from '@jest/globals'

import { lazyYobta } from '.'

describe('lazyYobta', () => {
  let args = {
    init: () => 1,
    terminate: () => {},
  }
  it('takes initial state as a value', () => {
    let store = lazyYobta(0)
    expect(store.last()).toBe(0)
  })
  it('takes initial state as a function', () => {
    let store = lazyYobta(() => 0)
    expect(store.last()).toBe(0)
  })
  it('keeps state when observed and flushes when unobserved', () => {
    let store = lazyYobta(0)
    let observer = jest.fn()
    let terminate = store.observe(observer)
    store.next(() => 1)
    expect(store.last()).toBe(1)
    terminate()
    expect(store.last()).toBe(0)
  })
  it('does not keep state when not observed', () => {
    let store = lazyYobta(0)
    store.next(() => 2)
    expect(store.last()).toBe(0)
  })
  it('calls initializers at right moments', () => {
    jest.spyOn(args, 'init')
    jest.spyOn(args, 'terminate')

    let observer1 = jest.fn()
    let observer2 = jest.fn()

    let store = lazyYobta(args.init, args.terminate)
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
