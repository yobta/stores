import { mapYobta } from './index.js'

it('has default state', () => {
  let store = mapYobta({ key: 'yobta' })
  expect(store.last()).toEqual(new Map([['key', 'yobta']]))
})

it('assigns', () => {
  let store = mapYobta({ key1: 'yobta', key2: 'yobta' })
  store.assign({ key2: 'yobta 3' })
  expect(store.last()).toEqual(
    new Map([
      ['key1', 'yobta'],
      ['key2', 'yobta 3'],
    ]),
  )
})

it('mutes at assign', () => {
  let store = mapYobta({ key: 'yobta' })
  let initialState = store.last()
  store.assign({ key: 'yobta 1' })
  expect(store.last()).toBe(initialState)
})

it('emits diff entries and overloads at assign', () => {
  let store = mapYobta({ key: 'yobta', key2: 'yobta' })
  let changes = vi.fn()
  let unobserve = store.observe(changes)
  store.assign({ key: 'yobta 1', key2: 'yobta' }, 1, 2, 3)
  expect(changes).toBeCalledWith(
    new Map([
      ['key', 'yobta 1'],
      ['key2', 'yobta'],
    ]),
    [['key', 'yobta 1']],
    1,
    2,
    3,
  )
  unobserve()
})

it('omits', () => {
  let store = mapYobta<{ key1: string; key2?: string }>({
    key1: 'yobta',
    key2: 'yobta',
  })
  store.omit(['key2'])
  expect(store.last()).toEqual(new Map([['key1', 'yobta']]))
})

it('mutates at omit', () => {
  let store = mapYobta<{ key?: string }>({ key: 'yobta' })
  let initialState = store.last()
  store.omit(['key'])
  expect(store.last()).toBe(initialState)
})

it('emits diff entries at omit', () => {
  let store = mapYobta<{ key?: string; key2?: string }>({
    key: 'yobta',
    key2: 'yobta',
  })
  let changes = vi.fn()
  let unobserve = store.observe(changes)
  store.omit(['key'], 1, 2, 3)
  expect(changes).toBeCalledWith(new Map([['key2', 'yobta']]), ['key'], 1, 2, 3)
  unobserve()
})
