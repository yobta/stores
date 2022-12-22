import { mapYobta } from './index.js'

it('has correct default state', () => {
  let store = mapYobta({ key: 'yobta' })
  expect(store.last()).toEqual(new Map([['key', 'yobta']]))
})

it('assigns values correctly', () => {
  let store = mapYobta({ key1: 'yobta', key2: 'yobta' })
  let changes = store.assign({ key2: 'yobta 3' })
  expect(store.last()).toEqual(
    new Map([
      ['key1', 'yobta'],
      ['key2', 'yobta 3'],
    ]),
  )
  expect(changes).toEqual(new Map([['key2', 'yobta 3']]))
})

it('does not mutate state when assigning values', () => {
  let store = mapYobta({ key: 'yobta' })
  let initialState = store.last()
  store.assign({ key: 'yobta 1' })
  expect(store.last()).not.toBe(initialState)
})

it('emits diff entries and passes additional arguments when assigning values', () => {
  let store = mapYobta({ key: 'yobta', key2: 'yobta' })
  let changes = vi.fn()
  let unobserve = store.observe(changes)
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
  let store = mapYobta<{ key1: string; key2?: string }>({
    key1: 'yobta',
    key2: 'yobta',
  })
  let changes = store.omit(['key2'])
  expect(store.last()).toEqual(new Map([['key1', 'yobta']]))
  expect(changes).toEqual(new Set(['key2']))
})

it('does not mutate state when omitting values', () => {
  let store = mapYobta<{ key?: string }>({ key: 'yobta' })
  let initialState = store.last()
  store.omit(['key'])
  expect(store.last()).not.toBe(initialState)
})

it('emits diff entries and passes additional arguments when omitting values', () => {
  let store = mapYobta<{ key?: string; key2?: string }>({
    key: 'yobta',
    key2: 'yobta',
  })
  let changes = vi.fn()
  let unobserve = store.observe(changes)
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
