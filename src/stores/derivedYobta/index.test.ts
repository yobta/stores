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

// test('edge', () => {
//   let store = storeYobta(1)
//   let derived = derivedYobta(state => state + 1, store)
//   let storeObserver = vi.fn()
//   let derivedObserver = vi.fn()
//   let unsubscribeStore = store.observe(storeObserver)
//   let unsubscribederived = derived.observe(derivedObserver)
//   expect(storeObserver).toBeCalledTimes(0)
//   expect(derivedObserver).toBeCalledTimes(0)
//   store.next(2)
//   expect(storeObserver).toBeCalledWith(2)
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(derivedObserver).toBeCalledWith(3)
//   expect(derivedObserver).toBeCalledTimes(1)
//   unsubscribeStore()
//   unsubscribederived()
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(derivedObserver).toBeCalledTimes(1)
// })

// test('triangle', () => {
//   let store = storeYobta(1)
//   let derived1 = derivedYobta(state => state + 1, store)
//   let derived2 = derivedYobta<number>(
//     (s1: number, s2: number) => s1 + s2,
//     derived1,
//     store,
//   )
//   let storeObserver = vi.fn()
//   let derived1Observer = vi.fn()
//   let derived2Observer = vi.fn()
//   let unsubscribeStore = store.observe(storeObserver)
//   let unsubscribederived1 = derived1.observe(derived1Observer)
//   let unsubscribederived2 = derived2.observe(derived2Observer)
//   expect(storeObserver).toBeCalledTimes(0)
//   expect(derived1Observer).toBeCalledTimes(0)
//   expect(derived2Observer).toBeCalledTimes(0)
//   store.next(2)
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(storeObserver.mock.calls).toEqual([[2]])
//   expect(derived1Observer).toBeCalledTimes(1)
//   expect(derived1Observer.mock.calls).toEqual([[3]])
//   expect(derived2Observer).toBeCalledTimes(2)
//   expect(derived2Observer.mock.calls).toEqual([[5], [5]])
//   unsubscribeStore()
//   unsubscribederived1()
//   unsubscribederived2()
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(derived1Observer).toBeCalledTimes(1)
//   expect(derived2Observer).toBeCalledTimes(2)
// })

// test('diamond', () => {
//   let store = storeYobta(1)
//   let derived1 = derivedYobta(state => state + 1, store)
//   let derived2 = derivedYobta(state => state + 1, store)
//   let derived3 = derivedYobta<number>(
//     (s1: number, s2: number) => s1 + s2,
//     derived1,
//     derived2,
//   )
//   let storeObserver = vi.fn()
//   let derived1Observer = vi.fn()
//   let derived2Observer = vi.fn()
//   let derived3Observer = vi.fn()
//   let unsubscribeStore = store.observe(storeObserver)
//   let unsubscribederived1 = derived1.observe(derived1Observer)
//   let unsubscribederived2 = derived2.observe(derived2Observer)
//   let unsubscribederived3 = derived3.observe(derived3Observer)
//   expect(storeObserver).toBeCalledTimes(0)
//   expect(derived1Observer).toBeCalledTimes(0)
//   expect(derived2Observer).toBeCalledTimes(0)
//   expect(derived3Observer).toBeCalledTimes(0)
//   store.next(2)
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(storeObserver.mock.calls).toEqual([[2]])
//   expect(derived1Observer).toBeCalledTimes(1)
//   expect(derived1Observer.mock.calls).toEqual([[3]])
//   expect(derived2Observer).toBeCalledTimes(1)
//   expect(derived2Observer.mock.calls).toEqual([[3]])
//   expect(derived3Observer).toBeCalledTimes(2)
//   expect(derived3Observer.mock.calls).toEqual([[5], [6]])
//   unsubscribeStore()
//   unsubscribederived1()
//   unsubscribederived2()
//   unsubscribederived3()
//   expect(storeObserver).toBeCalledTimes(1)
//   expect(derived1Observer).toBeCalledTimes(1)
//   expect(derived2Observer).toBeCalledTimes(1)
//   expect(derived3Observer).toBeCalledTimes(2)
// })

const replacer =
  (...args: [string, string]) =>
  (v: string) =>
    v.replace(...args)

test('prevents diamond dependency problem 1', () => {
  let mock = vi.fn()
  let store = storeYobta(0)
  let a = derivedYobta(v => `a${v}`, store)
  let b = derivedYobta(replacer('a', 'b'), a)
  let c = derivedYobta(replacer('a', 'c'), a)
  let d = derivedYobta(replacer('a', 'd'), a)

  let combined = derivedYobta(($b, $c, $d) => `${$b}-${$c}-${$d}`, b, c, d)

  let unsubscribe = combined.observe(mock)
  expect(combined.last()).toBe('b0-c0-d0')

  store.next(1)

  expect(mock.mock.calls).toEqual([['b1-c1-d1']])
  expect(combined.last()).toBe('b1-c1-d1')

  mock.mockClear()

  store.next(2)
  expect(mock.mock.calls).toEqual([['b2-c2-d2']])
  expect(combined.last()).toBe('b2-c2-d2')

  unsubscribe()
})

test('prevents diamond dependency problem 2', () => {
  let store = storeYobta(0)
  let mock = vi.fn()

  let a = derivedYobta(v => `a${v}`, store)
  let b = derivedYobta(replacer('a', 'b'), a)
  let c = derivedYobta(replacer('b', 'c'), b)
  let d = derivedYobta(replacer('c', 'd'), c)
  let e = derivedYobta(replacer('d', 'e'), d)

  let combined = derivedYobta((...args) => args.join(''), a, e)
  let unsubscribe = combined.observe(mock)

  expect(combined.last()).toBe('a0e0')
  expect(mock).toBeCalledTimes(0)

  store.next(1)
  expect(mock.mock.calls).toEqual([['a1e1']])

  unsubscribe()
})

test('prevents diamond dependency problem 3', () => {
  let store = storeYobta(0)
  let mock = vi.fn()

  let a = derivedYobta($store => `a${$store}`, store)
  let b = derivedYobta(replacer('a', 'b'), a)
  let c = derivedYobta(replacer('b', 'c'), b)
  let d = derivedYobta(replacer('c', 'd'), c)

  let combined = derivedYobta(
    ($a, $b, $c, $d) => `${$a}${$b}${$c}${$d}`,
    a,
    b,
    c,
    d,
  )

  let unsubscribe = combined.observe(mock)

  expect(combined.last()).toBe('a0b0c0d0')

  store.next(1)
  expect(mock.mock.calls).toEqual([['a1b1c1d1']])
  // equal(values, ['a0b0c0d0', 'a1b1c1d1'])

  unsubscribe()
})
