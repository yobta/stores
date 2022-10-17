import { YobtaEncoder } from '../util/encoderYobta/index.js'
import { localStorageMiddlewareYobta } from './localStorageMiddlewareYobta.js'

let defaultItem = JSON.stringify(['stored yobta'])
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
    let state = localStorageMiddlewareYobta({ channel: 'yobta' }).ready('yobta')
    expect(state).toBe('yobta')
  })
  it('returns stored state when session storage is not empty', () => {
    let state = localStorageMiddlewareYobta({ channel: 'yobta' }).ready('yobta')
    expect(state).toBe('stored yobta')
  })
})

describe('next', () => {
  it('sets ls item', () => {
    localStorageMiddlewareYobta({ channel: 'yobta' }).next('yobta')
    expect(lsMock.setItem).toHaveBeenCalledWith(
      'yobta',
      JSON.stringify(['yobta']),
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
      newValue: JSON.stringify(['yobta']),
    })
    expect(observer).toHaveBeenCalledWith('yobta')

    unobserve()
    expect(windowMock.removeEventListener).toHaveBeenCalledTimes(1)
  })
})

describe('encoder', () => {
  let decode = vi.fn()
  let encoder: YobtaEncoder = {
    encode: vi.fn(),
    decode: <R>(...args: any[]) => {
      decode(...args)
      return [] as R
    },
  }
  it('decodes initial', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).ready('yobta')
    expect(encoder.encode).not.toHaveBeenCalled()
    expect(decode).toHaveBeenCalledTimes(1)
    expect(decode).toHaveBeenCalledWith(defaultItem)
  })
  it('encodes next', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).next(
      'yobta',
      'overload',
    )
    expect(decode).not.toHaveBeenCalled()
    expect(encoder.encode).toHaveBeenCalledTimes(1)
    expect(encoder.encode).toHaveBeenCalledWith(['yobta', 'overload'])
  })
  it('encodes observer message', () => {
    localStorageMiddlewareYobta({ channel: 'yobta', encoder }).observe(() => {})
    windowMock.addEventListener.mock.calls[0][1]({
      key: 'yobta',
      newValue: JSON.stringify(['yobta', 'overload']),
    })
    expect(encoder.encode).not.toHaveBeenCalled()
    expect(decode).toHaveBeenCalledTimes(1)
    expect(decode).toHaveBeenCalledWith(JSON.stringify(['yobta', 'overload']))
  })
})
