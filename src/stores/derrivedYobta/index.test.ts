import { derrivedYobta } from '.'
import { storeYobta } from '../storeYobta/index.js'

test('return type', () => {
  let store = storeYobta(1)
  let derrived = derrivedYobta(state => state + 1, store)
  expect(derrived).toMatchObject({
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

test('initial state', () => {
  let store = storeYobta(1)
  let derrived = derrivedYobta(state => state + 1, store)
  expect(derrived.last()).toBe(2)
})

test('edge', () => {
  let store = storeYobta(1)
  let derrived = derrivedYobta(state => state + 1, store)
  let storeObserver = vi.fn()
  let derrivedObserver = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribeDerrived = derrived.observe(derrivedObserver)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derrivedObserver).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrivedObserver).toBeCalledWith(3)
  expect(derrivedObserver).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribeDerrived()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrivedObserver).toBeCalledTimes(1)
})

test('triangle', () => {
  let store = storeYobta(1)
  let derrived1 = derrivedYobta(state => state + 1, store)
  let derrived2 = derrivedYobta<number>(
    (s1: number, s2: number) => s1 + s2,
    derrived1,
    store,
  )
  let storeObserver = vi.fn()
  let derrived1Observer = vi.fn()
  let derrived2Observer = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribeDerrived1 = derrived1.observe(derrived1Observer)
  let unsubscribeDerrived2 = derrived2.observe(derrived2Observer)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derrived1Observer).toBeCalledTimes(0)
  expect(derrived2Observer).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrived1Observer).toBeCalledWith(3)
  expect(derrived1Observer).toBeCalledTimes(1)
  expect(derrived2Observer).toBeCalledWith(5)
  expect(derrived2Observer).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribeDerrived1()
  unsubscribeDerrived2()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrived1Observer).toBeCalledTimes(1)
  expect(derrived2Observer).toBeCalledTimes(1)
})

test('diamond', () => {
  let store = storeYobta(1)
  let derrived1 = derrivedYobta(state => state + 1, store)
  let derrived2 = derrivedYobta(state => state + 1, store)
  let derrived3 = derrivedYobta<number>(
    (s1: number, s2: number) => s1 + s2,
    derrived1,
    derrived2,
  )
  let storeObserver = vi.fn()
  let derrived1Observer = vi.fn()
  let derrived2Observer = vi.fn()
  let derrived3Observer = vi.fn()
  let unsubscribeStore = store.observe(storeObserver)
  let unsubscribeDerrived1 = derrived1.observe(derrived1Observer)
  let unsubscribeDerrived2 = derrived2.observe(derrived2Observer)
  let unsubscribeDerrived3 = derrived3.observe(derrived3Observer)
  expect(storeObserver).toBeCalledTimes(0)
  expect(derrived1Observer).toBeCalledTimes(0)
  expect(derrived2Observer).toBeCalledTimes(0)
  expect(derrived3Observer).toBeCalledTimes(0)
  store.next(2)
  expect(storeObserver).toBeCalledWith(2)
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrived1Observer).toBeCalledWith(3)
  expect(derrived1Observer).toBeCalledTimes(1)
  expect(derrived2Observer).toBeCalledWith(3)
  expect(derrived2Observer).toBeCalledTimes(1)
  expect(derrived3Observer).toBeCalledWith(6)
  expect(derrived3Observer).toBeCalledTimes(1)
  unsubscribeStore()
  unsubscribeDerrived1()
  unsubscribeDerrived2()
  unsubscribeDerrived3()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derrived1Observer).toBeCalledTimes(1)
  expect(derrived2Observer).toBeCalledTimes(1)
  expect(derrived3Observer).toBeCalledTimes(1)
})
