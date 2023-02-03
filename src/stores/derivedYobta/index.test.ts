import { derivedYobta } from './index.js'
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
  expect(storeObserver).toBeCalledTimes(1)
  expect(storeObserver.mock.calls).toEqual([[2]])
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived1Observer.mock.calls).toEqual([[3]])
  expect(derived2Observer).toBeCalledTimes(1)
  expect(derived2Observer.mock.calls).toEqual([[5]])
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
  expect(storeObserver).toBeCalledTimes(1)
  expect(storeObserver.mock.calls).toEqual([[2]])
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived1Observer.mock.calls).toEqual([[3]])
  expect(derived2Observer).toBeCalledTimes(1)
  expect(derived2Observer.mock.calls).toEqual([[3]])
  expect(derived3Observer).toBeCalledTimes(1)
  expect(derived3Observer.mock.calls).toEqual([[6]])
  unsubscribeStore()
  unsubscribederived1()
  unsubscribederived2()
  unsubscribederived3()
  expect(storeObserver).toBeCalledTimes(1)
  expect(derived1Observer).toBeCalledTimes(1)
  expect(derived2Observer).toBeCalledTimes(1)
  expect(derived3Observer).toBeCalledTimes(1)
})

// note: reproduceng tests from nanostores
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

  unsubscribe()
})

test('prevents diamond dependency problem 4 (complex)', () => {
  let store1 = storeYobta<number>(0)
  let store2 = storeYobta<number>(0)

  let mock1 = vi.fn()
  let mock2 = vi.fn()

  let fn =
    (name: string) =>
    (...v: (string | number)[]) =>
      `${name}${v.join('')}`

  let a = derivedYobta(fn('a'), store1)
  let b = derivedYobta(fn('b'), store2)

  let c = derivedYobta(fn('c'), a, b)
  let d = derivedYobta(fn('d'), a)

  let e = derivedYobta(fn('e'), c, d)

  let f = derivedYobta(fn('f'), e)
  let g = derivedYobta(fn('g'), f)

  let combined1 = derivedYobta((...args) => args.join(''), e)
  let combined2 = derivedYobta((...args) => args.join(''), e, g)

  let unsubscribe1 = combined1.observe(mock1)
  let unsubscribe2 = combined2.observe(mock2)

  expect(combined1.last()).toBe('eca0b0da0')
  expect(combined2.last()).toBe('eca0b0da0gfeca0b0da0')

  store1.next(1)
  expect(mock1.mock.calls).toEqual([['eca1b0da1']])
  expect(mock2.mock.calls).toEqual([['eca1b0da1gfeca1b0da1']])

  store2.next(2)
  expect(mock1.mock.calls).toEqual([['eca1b0da1'], ['eca1b2da1']])
  expect(mock2.mock.calls).toEqual([
    ['eca1b0da1gfeca1b0da1'],
    ['eca1b2da1gfeca1b2da1'],
  ])

  unsubscribe1()
  unsubscribe2()
})

test('prevents diamond dependency problem 5', () => {
  let events = ''
  let firstName = storeYobta('John')
  let lastName = storeYobta('Doe')
  let fullName = derivedYobta(
    (first, last) => {
      events += 'full '
      return `${first} ${last}`
    },
    firstName,
    lastName,
  )
  let isFirstShort = derivedYobta(name => {
    events += 'short '
    return name.length < 10
  }, firstName)
  let displayName = derivedYobta(
    (first, isShort, full) => {
      events += 'display '
      return isShort ? full : first
    },
    firstName,
    isFirstShort,
    fullName,
  )

  expect(events).toBe('full short display ')

  displayName.observe(() => {})
  expect(displayName.last()).toBe('John Doe')
  expect(events).toBe('full short display short full display ')

  firstName.next('Benedict')
  expect(displayName.last()).toBe('Benedict Doe')
  expect(events).toBe(
    'full short display short full display short full display ',
  )

  firstName.next('Montgomery')
  expect(displayName.last()).toBe('Montgomery')
  expect(events).toBe(
    'full short display short full display short full display short full display ',
  )
})

test('prevents diamond dependency problem 6', () => {
  let store1 = storeYobta<number>(0)
  let store2 = storeYobta<number>(0)
  let mock = vi.fn()

  let a = derivedYobta(v => `a${v}`, store1)
  let b = derivedYobta(v => `b${v}`, store2)
  let c = derivedYobta(v => v.replace('b', 'c'), b)

  let combined = derivedYobta(($a, $c) => `${$a}${$c}`, a, c)

  let unsubscribe = combined.observe(mock)

  expect(mock).toBeCalledTimes(0)
  expect(combined.last()).toBe('a0c0')

  store1.next(1)
  expect(mock.mock.calls).toEqual([['a1c0']])

  unsubscribe()
})
