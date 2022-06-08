import { mapYobta } from './index.js'

describe('mapYobta', () => {
  it('has default state', () => {
    let store = mapYobta({ key: 'yobta' })
    expect(store.last()).toEqual({ key: 'yobta' })
  })

  it('sets next state', () => {
    let store = mapYobta({ key: 'yobta' })
    store.next({ key: 'yobta 1' })
    expect(store.last()).toEqual({ key: 'yobta 1' })
  })

  it('assigns', () => {
    let store = mapYobta({ key1: 'yobta 1', key2: 'yobta 2' })
    store.assign({ key2: 'yobta 3' })
    expect(store.last()).toEqual({ key1: 'yobta 1', key2: 'yobta 3' })
  })

  it('omits', () => {
    type Store = {
      key1: string
      key2?: string
      key3?: string
    }
    let store = mapYobta<Store>({ key1: 'yobta 1', key2: 'yobta 2' })
    let result = store.omit('key2', 'key3')

    expect(store.last()).toEqual({ key1: 'yobta 1' })
    expect(result).toEqual(['key2'])
  })
})
