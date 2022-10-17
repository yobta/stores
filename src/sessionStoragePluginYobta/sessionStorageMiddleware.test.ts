import { sessionStorageMiddleware } from './sessionStorageMiddleware.js'

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
    let state = sessionStorageMiddleware({ channel: 'yobta' }).initial('yobta')
    expect(state).toBe('yobta')
  })
  it('returns stored state when session storage is not empty', () => {
    let state = sessionStorageMiddleware({ channel: 'yobta' }).initial('yobta')
    expect(state).toBe('stored yobta')
  })
})

describe('next', () => {
  it('stores message', () => {
    let channel = sessionStorageMiddleware({ channel: 'yobta' })
    channel.next('yobta')
    expect(ssMock.setItem).toHaveBeenCalledWith(
      'yobta',
      JSON.stringify('yobta'),
    )
  })
})

describe('encoder', () => {
  it('decodes initial', () => {
    sessionStorageMiddleware({ channel: 'yobta', encoder }).initial('yobta')
    expect(encoder.decode).toHaveBeenCalledWith(defaultItem)
    expect(encoder.encode).not.toHaveBeenCalled()
  })
  it('encides next', () => {
    sessionStorageMiddleware({ channel: 'yobta', encoder }).next('yobta')
    expect(encoder.encode).toHaveBeenCalledWith('yobta')
    expect(encoder.decode).not.toHaveBeenCalled()
  })
})
