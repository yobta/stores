import { createObservable } from './index.js'

it('returns jemCutter object', () => {
  expect(createObservable()).toEqual({
    next: expect.any(Function),
    observe: expect.any(Function),
    size: expect.any(Number),
  })
})

it('calls observer with state and overloads', () => {
  const observer = vi.fn()
  const gemCutter = createObservable()
  gemCutter.observe(observer)
  gemCutter.next('state', 'overload')
  expect(observer).toBeCalledWith('state', 'overload')
})

it('does not call observer after remove', () => {
  const observer = vi.fn()
  const gemCutter = createObservable()
  const remove = gemCutter.observe(observer)
  remove()
  gemCutter.next('state', 'overload')
  expect(observer).not.toBeCalled()
})

it('deduplicates observers', () => {
  const observer = vi.fn()
  const gemCutter = createObservable()
  gemCutter.observe(observer)
  gemCutter.observe(observer)
  gemCutter.next('state', 'overload')
  expect(observer).toBeCalledTimes(1)
})

it('calls callbacks after observers', () => {
  const observer = vi.fn()
  const gemCutter = createObservable()
  gemCutter.observe(state => observer(state), observer)
  gemCutter.observe(state => observer(state), observer)
  gemCutter.next('state')
  expect(observer.mock.calls).toEqual([['state'], ['state'], ['state']])
  expect(observer).toBeCalledTimes(3)
})

it('deduplicates callbacks', () => {
  const observer = vi.fn()
  const callback = vi.fn()
  const gemCutter = createObservable()
  gemCutter.observe(observer, callback, callback)
  gemCutter.observe(observer, callback)
  gemCutter.next('state')
  expect(callback).toBeCalledTimes(1)
})

it('does not call callbacks after remove', () => {
  const observer = vi.fn()
  const callback = vi.fn()
  const gemCutter = createObservable()
  const remove = gemCutter.observe(observer, callback)
  remove()
  gemCutter.next('state')
  expect(callback).not.toBeCalled()
})

it('returns correct size', () => {
  const observer = vi.fn()
  const gemCutter = createObservable()
  const remove1 = gemCutter.observe(observer)
  expect(gemCutter.size).toBe(1)
  const remove2 = gemCutter.observe(observer)
  expect(gemCutter.size).toBe(2)
  remove1()
  expect(gemCutter.size).toBe(1)
  remove2()
  expect(gemCutter.size).toBe(0)
})
