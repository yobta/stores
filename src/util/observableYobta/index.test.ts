import { observableYobta, YobtaObserver } from './index.js'

it('should create an observable object', () => {
  let observable = observableYobta<string>()
  expect(observable).toEqual({
    next: expect.any(Function),
    observe: expect.any(Function),
    size: 0,
  })
})

it('should allow observers to be added and removed', () => {
  let observable = observableYobta<string>()
  let observer: YobtaObserver<string> = vi.fn()
  let unsubscribe = observable.observe(observer)

  expect(observer).not.toHaveBeenCalled()

  observable.next('hello')
  expect(observer).toHaveBeenCalledWith('hello')

  unsubscribe()
  observable.next('world')
  expect(observer).toHaveBeenCalledTimes(1)
})

it('should pass along any additional arguments to the observer', () => {
  let observable = observableYobta<string>()
  let observer: YobtaObserver<string> = vi.fn()
  let unsubscribe = observable.observe(observer)

  observable.next('hello', 1, 2, 3)
  expect(observer).toHaveBeenCalledWith('hello', 1, 2, 3)
  unsubscribe()
})

it('should return the number of observers', () => {
  let observable = observableYobta<string>()
  let observer: YobtaObserver<string> = vi.fn()
  let unsubscribe = observable.observe(observer)

  expect(observable.size).toBe(1)
  unsubscribe()
  expect(observable.size).toBe(0)
})
