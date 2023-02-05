import { createObservable } from './index.js'

it('returns jemCutter object', () => {
  expect(createObservable()).toEqual({
    next: expect.any(Function),
    observe: expect.any(Function),
    size: expect.any(Number),
  })
})

it('calls observer with state and overloads', () => {
  let observer = vi.fn()
  let gemCutter = createObservable()
  gemCutter.observe(observer)
  gemCutter.next('state', 'overload')
  expect(observer).toBeCalledWith('state', 'overload')
})

it('does not call observer after remove', () => {
  let observer = vi.fn()
  let gemCutter = createObservable()
  let remove = gemCutter.observe(observer)
  remove()
  gemCutter.next('state', 'overload')
  expect(observer).not.toBeCalled()
})

it('deduplicates observers', () => {
  let observer = vi.fn()
  let gemCutter = createObservable()
  gemCutter.observe(observer)
  gemCutter.observe(observer)
  gemCutter.next('state', 'overload')
  expect(observer).toBeCalledTimes(1)
})

it('calls callbacks after observers', () => {
  let observer = vi.fn()
  let gemCutter = createObservable()
  gemCutter.observe(state => observer(state), observer)
  gemCutter.observe(state => observer(state), observer)
  gemCutter.next('state')
  expect(observer.mock.calls).toEqual([['state'], ['state'], ['state']])
  expect(observer).toBeCalledTimes(3)
})

it('deduplicates callbacks', () => {
  let observer = vi.fn()
  let callback = vi.fn()
  let gemCutter = createObservable()
  gemCutter.observe(observer, callback, callback)
  gemCutter.observe(observer, callback)
  gemCutter.next('state')
  expect(callback).toBeCalledTimes(1)
})

it('does not call callbacks after remove', () => {
  let observer = vi.fn()
  let callback = vi.fn()
  let gemCutter = createObservable()
  let remove = gemCutter.observe(observer, callback)
  remove()
  gemCutter.next('state')
  expect(callback).not.toBeCalled()
})

it('returns correct size', () => {
  let observer = vi.fn()
  let gemCutter = createObservable()
  let remove1 = gemCutter.observe(observer)
  expect(gemCutter.size).toBe(1)
  let remove2 = gemCutter.observe(observer)
  expect(gemCutter.size).toBe(2)
  remove1()
  expect(gemCutter.size).toBe(1)
  remove2()
  expect(gemCutter.size).toBe(0)
})
