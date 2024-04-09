import { createMapStore } from './index.js'

it('returns store object', () => {
  const store = createMapStore({ key: 'yobta' })
  expect(store).toEqual({
    assign: expect.any(Function),
    last: expect.any(Function),
    observe: expect.any(Function),
    omit: expect.any(Function),
    on: expect.any(Function),
  })
})

it('has correct default state', () => {
  const store = createMapStore({ key: 'yobta' })
  expect(store.last()).toEqual(new Map([['key', 'yobta']]))
})

it('assigns values correctly', () => {
  const store = createMapStore({ key1: 'yobta', key2: 'yobta' })
  const changes = store.assign({ key2: 'yobta 3' })
  expect(store.last()).toEqual(
    new Map([
      ['key1', 'yobta'],
      ['key2', 'yobta 3'],
    ]),
  )
  expect(changes).toEqual(new Map([['key2', 'yobta 3']]))
})

it('does not mutate state when assigning values', () => {
  const store = createMapStore({ key: 'yobta' })
  const initialState = store.last()
  store.assign({ key: 'yobta 1' })
  expect(store.last()).not.toBe(initialState)
})

it('emits diff entries and passes additional arguments when assigning values', () => {
  const store = createMapStore({ key: 'yobta', key2: 'yobta' })
  const changes = vi.fn()
  const unobserve = store.observe(changes)
  store.assign({ key: 'yobta 1', key2: 'yobta' }, 1, 2, 3)
  expect(changes).toBeCalledWith(
    new Map([
      ['key', 'yobta 1'],
      ['key2', 'yobta'],
    ]),
    new Map([['key', 'yobta 1']]),
    1,
    2,
    3,
  )
  unobserve()
})

it('omits values correctly', () => {
  const store = createMapStore<{ key1: string; key2?: string }>({
    key1: 'yobta',
    key2: 'yobta',
  })
  const changes = store.omit(['key2'])
  expect(store.last()).toEqual(new Map([['key1', 'yobta']]))
  expect(changes).toEqual(new Set(['key2']))
})

it('does not mutate state when omitting values', () => {
  const store = createMapStore<{ key?: string }>({ key: 'yobta' })
  const initialState = store.last()
  store.omit(['key'])
  expect(store.last()).not.toBe(initialState)
})

it('emits diff entries and passes additional arguments when omitting values', () => {
  const store = createMapStore<{ key?: string; key2?: string }>({
    key: 'yobta',
    key2: 'yobta',
  })
  const changes = vi.fn()
  const unobserve = store.observe(changes)
  store.omit(['key'], 1, 2, 3)
  expect(changes).toBeCalledWith(
    new Map([['key2', 'yobta']]),
    new Set(['key']),
    1,
    2,
    3,
  )
  unobserve()
})
