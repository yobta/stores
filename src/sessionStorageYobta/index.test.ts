import { sessionStorageYobta } from './index.js'

let defaultItem = JSON.stringify('stored yobta')
let item: string | null = defaultItem
let ssMock = {
  getItem: () => item,
  setItem: vi.fn(),
}
let encoder = {
  encode: vi.fn(),
  decode: vi.fn(),
}

vi.stubGlobal('sessionStorage', ssMock)

beforeEach(() => {
  item = defaultItem
})

describe('init', () => {
  it('returns initial state when session storage is empty', () => {
    item = null
    let state = sessionStorageYobta({ channel: 'yobta' }).initial('yobta')
    expect(state).toBe('yobta')
  })
  it('returns stored state when session storage is not empty', () => {
    let state = sessionStorageYobta({ channel: 'yobta' }).initial('yobta')
    expect(state).toBe('stored yobta')
  })
})

describe('next', () => {
  it('stores message', () => {
    let channel = sessionStorageYobta({ channel: 'yobta' })
    channel.next('yobta')
    expect(ssMock.setItem).toHaveBeenCalledWith(
      'yobta',
      JSON.stringify('yobta'),
    )
  })
})

describe('encoder', () => {
  it('decodes initial', () => {
    sessionStorageYobta({ channel: 'yobta', encoder }).initial('yobta')
    expect(encoder.decode).toHaveBeenCalledWith(defaultItem)
    expect(encoder.encode).not.toHaveBeenCalled()
  })
  it('encides next', () => {
    sessionStorageYobta({ channel: 'yobta', encoder }).next('yobta')
    expect(encoder.encode).toHaveBeenCalledWith('yobta')
    expect(encoder.decode).not.toHaveBeenCalled()
  })
})
