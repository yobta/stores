import { derivedYobta } from '.'
import { storeYobta } from '../storeYobta/index.js'

test('return type', () => {
  let store = storeYobta(1)
  let derived = derivedYobta(state => state + 1, store)
  expect(derived).toMatchObject({
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

test('initial state', () => {
  let store = storeYobta(1)
  let derived = derivedYobta(state => state + 1, store)
  expect(derived.last()).toBe(2)
})

test('edge', () => {
  let store = storeYobta(1)
  let derived = derivedYobta(state => state + 1, store)
  let storeObserver = vi.fn()
  let derivedObserver = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribederived = derived.observe(derivedObserver)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derivedObserver).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derivedObserver).toBeCalledWith(3)
  expect(derivedObserver).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribederived()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derivedObserver).toBeCalledTimes(1)
})

test('triangle', () => {
  let store = storeYobta(1)
  let derived1 = derivedYobta(state => state + 1, store)
  let derived2 = derivedYobta<number>(
    (s1: number, s2: number) => s1 + s2,
    derived1,
    store,
  )
  let storeObserver = vi.fn()
  let derived1Observer = vi.fn()
  let derived2Observer = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribederived1 = derived1.observe(derived1Observer)
  let unsubscribederived2 = derived2.observe(derived2Observer)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derived1Observer).toBeCalledTimes(0)
  expect(derived2Observer).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derived1Observer).toBeCalledWith(3)
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived2Observer).toBeCalledWith(5)
  expect(derived2Observer).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribederived1()
  unsubscribederived2()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived2Observer).toBeCalledTimes(1)
})

test('diamond', () => {
  let store = storeYobta(1)
  let derived1 = derivedYobta(state => state + 1, store)
  let derived2 = derivedYobta(state => state + 1, store)
  let derived3 = derivedYobta<number>(
    (s1: number, s2: number) => s1 + s2,
    derived1,
    derived2,
  )
  let storeObserver = vi.fn()
  let derived1Observer = vi.fn()
  let derived2Observer = vi.fn()
  let derived3Observer = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribederived1 = derived1.observe(derived1Observer)
  let unsubscribederived2 = derived2.observe(derived2Observer)
  let unsubscribederived3 = derived3.observe(derived3Observer)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derived1Observer).toBeCalledTimes(0)
  expect(derived2Observer).toBeCalledTimes(0)
  expect(derived3Observer).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derived1Observer).toBeCalledWith(3)
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived2Observer).toBeCalledWith(3)
  expect(derived2Observer).toBeCalledTimes(1)
  expect(derived3Observer).toBeCalledWith(6)
  expect(derived3Observer).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribederived1()
  unsubscribederived2()
  unsubscribederived3()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived2Observer).toBeCalledTimes(1)
  expect(derived3Observer).toBeCalledTimes(1)
})
