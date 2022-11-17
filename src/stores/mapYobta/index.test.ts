import { mapYobta } from './index.js'

describe('mapYobta', () => {
  it('has default state', () => {
    let store = mapYobta({ key: 'yobta' })
    expect(store.last()).toEqual(new Map([['key', 'yobta']]))
  })

  it('sets next state', () => {
    let store = mapYobta({ key: 'yobta' })
    store.assign({ key: 'yobta 1' })
    expect(store.last()).toEqual(new Map([['key', 'yobta 1']]))
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

  it('emits diff entries and overloads', () => {
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
})
