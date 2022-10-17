import { localStorageMiddlewareYobta } from './localStorageMiddlewareYobta.js'

let defaultItem = JSON.stringify('stored yobta')
let item: string | null = null

let lsMock = {
  getItem: () => item,
  setItem: vi.fn(),
}

vi.stubGlobal('localStorage', lsMock)

let windowMock = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

vi.stubGlobal('window', windowMock)

beforeEach(() => {
  item = defaultItem
})

describe('initial', () => {
  it('returns initial state when session storage is empty', () => {
    item = null
    let state = localStorageMiddlewareYobta({ channel: 'yobta' }).initial(
      'yobta',
    )
    expect(state).toBe('yobta')
  })
  it('returns stored state when session storage is not empty', () => {
    let state = localStorageMiddlewareYobta({ channel: 'yobta' }).initial(
      'yobta',
    )
    expect(state).toBe('stored yobta')
  })
})

describe('next', () => {
  it('sets ls item', () => {
    localStorageMiddlewareYobta({ channel: 'yobta' }).next('yobta')
    expect(lsMock.setItem).toHaveBeenCalledWith(
      'yobta',
      JSON.stringify('yobta'),
    )
  })
})

describe('observe', () => {
  it('subscribes, receives update, and unsubscribes', () => {
    let observer = vi.fn()

    let channel = localStorageMiddlewareYobta({ channel: 'yobta' })
    let unobserve = channel.observe(observer)
    expect(windowMock.addEventListener).toHaveBeenCalledTimes(1)

    windowMock.addEventListener.mock.calls[0][1]({
      key: 'yobta',
      newValue: JSON.stringify('yobta'),
    })
    expect(observer).toHaveBeenCalledWith('yobta')

    unobserve()
    expect(windowMock.removeEventListener).toHaveBeenCalledTimes(1)
  })
})

describe('encoder', () => {
  let encoder = {
    encode: vi.fn(),
    decode: vi.fn(),
  }
  it('decodes initial', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).initial('yobta')
    expect(encoder.encode).not.toHaveBeenCalled()
    expect(encoder.decode).toHaveBeenCalledTimes(1)
    expect(encoder.decode).toHaveBeenCalledWith(defaultItem)
  })
  it('encodes next', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).next('yobta')
    expect(encoder.decode).not.toHaveBeenCalled()
    expect(encoder.encode).toHaveBeenCalledTimes(1)
    expect(encoder.encode).toHaveBeenCalledWith('yobta')
  })
  it('encodes observer message', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).observe(() => {})
    windowMock.addEventListener.mock.calls[0][1]({
      key: 'yobta',
      newValue: JSON.stringify('yobta'),
    })
    expect(encoder.encode).not.toHaveBeenCalled()
    expect(encoder.decode).toHaveBeenCalledTimes(1)
    expect(encoder.decode).toHaveBeenCalledWith(JSON.stringify('yobta'))
  })
})
