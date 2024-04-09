import { createDerivedStore } from './index.js'
import { createStore } from '../createStore/index.js'

test('return type', () => {
  const store = createStore(1)
  const derived = createDerivedStore(state => state + 1, store)
  expect(derived).toMatchObject({
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

test('initial state', () => {
  const store = createStore(1)
  const derived = createDerivedStore(state => state + 1, store)
  expect(derived.last()).toBe(2)

  store.next(2)
  expect(derived.last()).toBe(2)

  const stop = derived.observe(() => {})
  expect(derived.last()).toBe(3)
  stop()
})

test('edge', () => {
  const store = createStore(1)
  const derived = createDerivedStore(state => state + 1, store)
  const storeObserver = vi.fn()
  const derivedObserver = vi.fn()
  const unsubscribeStore = store.observe(storeObserver)
  const unsubscribederived = derived.observe(derivedObserver)
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
  const store = createStore(1)
  const derived1 = createDerivedStore(state => state + 1, store)
  const derived2 = createDerivedStore<number>(
    (s1: number, s2: number) => s1 + s2,
    derived1,
    store,
  )
  const storeObserver = vi.fn()
  const derived1Observer = vi.fn()
  const derived2Observer = vi.fn()
  const unsubscribeStore = store.observe(storeObserver)
  const unsubscribederived1 = derived1.observe(derived1Observer)
  const unsubscribederived2 = derived2.observe(derived2Observer)
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
  const store = createStore(1)
  const derived1 = createDerivedStore(state => state + 1, store)
  const derived2 = createDerivedStore(state => state + 1, store)
  const derived3 = createDerivedStore<number>(
    (s1: number, s2: number) => s1 + s2,
    derived1,
    derived2,
  )
  const storeObserver = vi.fn()
  const derived1Observer = vi.fn()
  const derived2Observer = vi.fn()
  const derived3Observer = vi.fn()
  const unsubscribeStore = store.observe(storeObserver)
  const unsubscribederived1 = derived1.observe(derived1Observer)
  const unsubscribederived2 = derived2.observe(derived2Observer)
  const unsubscribederived3 = derived3.observe(derived3Observer)
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
  const mock = vi.fn()
  const store = createStore(0)
  const a = createDerivedStore(v => `a${v}`, store)
  const b = createDerivedStore(replacer('a', 'b'), a)
  const c = createDerivedStore(replacer('a', 'c'), a)
  const d = createDerivedStore(replacer('a', 'd'), a)

  const combined = createDerivedStore(
    ($b, $c, $d) => `${$b}-${$c}-${$d}`,
    b,
    c,
    d,
  )

  const unsubscribe = combined.observe(mock)
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
  const store = createStore(0)
  const mock = vi.fn()

  const a = createDerivedStore(v => `a${v}`, store)
  const b = createDerivedStore(replacer('a', 'b'), a)
  const c = createDerivedStore(replacer('b', 'c'), b)
  const d = createDerivedStore(replacer('c', 'd'), c)
  const e = createDerivedStore(replacer('d', 'e'), d)

  const combined = createDerivedStore((...args) => args.join(''), a, e)
  const unsubscribe = combined.observe(mock)

  expect(combined.last()).toBe('a0e0')
  expect(mock).toBeCalledTimes(0)

  store.next(1)
  expect(mock.mock.calls).toEqual([['a1e1']])

  unsubscribe()
})

test('prevents diamond dependency problem 3', () => {
  const store = createStore(0)
  const mock = vi.fn()

  const a = createDerivedStore($store => `a${$store}`, store)
  const b = createDerivedStore(replacer('a', 'b'), a)
  const c = createDerivedStore(replacer('b', 'c'), b)
  const d = createDerivedStore(replacer('c', 'd'), c)

  const combined = createDerivedStore(
    ($a, $b, $c, $d) => `${$a}${$b}${$c}${$d}`,
    a,
    b,
    c,
    d,
  )

  const unsubscribe = combined.observe(mock)

  expect(combined.last()).toBe('a0b0c0d0')

  store.next(1)
  expect(mock.mock.calls).toEqual([['a1b1c1d1']])

  unsubscribe()
})

test('prevents diamond dependency problem 4 (complex)', () => {
  const store1 = createStore<number>(0)
  const store2 = createStore<number>(0)

  const mock1 = vi.fn()
  const mock2 = vi.fn()

  const fn =
    (name: string) =>
    (...v: (string | number)[]) =>
      `${name}${v.join('')}`

  const a = createDerivedStore(fn('a'), store1)
  const b = createDerivedStore(fn('b'), store2)

  const c = createDerivedStore(fn('c'), a, b)
  const d = createDerivedStore(fn('d'), a)

  const e = createDerivedStore(fn('e'), c, d)

  const f = createDerivedStore(fn('f'), e)
  const g = createDerivedStore(fn('g'), f)

  const combined1 = createDerivedStore((...args) => args.join(''), e)
  const combined2 = createDerivedStore((...args) => args.join(''), e, g)

  const unsubscribe1 = combined1.observe(mock1)
  const unsubscribe2 = combined2.observe(mock2)

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
  const firstName = createStore('John')
  const lastName = createStore('Doe')
  const fullName = createDerivedStore(
    (first, last) => {
      events += 'full '
      return `${first} ${last}`
    },
    firstName,
    lastName,
  )
  const isFirstShort = createDerivedStore(name => {
    events += 'short '
    return name.length < 10
  }, firstName)
  const displayName = createDerivedStore(
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
  const store1 = createStore<number>(0)
  const store2 = createStore<number>(0)
  const mock = vi.fn()

  const a = createDerivedStore(v => `a${v}`, store1)
  const b = createDerivedStore(v => `b${v}`, store2)
  const c = createDerivedStore(v => v.replace('b', 'c'), b)

  const combined = createDerivedStore(($a, $c) => `${$a}${$c}`, a, c)

  const unsubscribe = combined.observe(mock)

  expect(mock).toBeCalledTimes(0)
  expect(combined.last()).toBe('a0c0')

  store1.next(1)
  expect(mock.mock.calls).toEqual([['a1c0']])

  unsubscribe()
})
