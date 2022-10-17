/* eslint-disable accessor-pairs */
import { broadcastChannelMiddlewareYobta } from './broadcastChannelMiddlewareYobta.js'

const postMessage = vi.fn()
const onmessage = vi.fn()
const close = vi.fn()
const observer = vi.fn()

const broadcastChannelMock = vi.fn(() => ({
  postMessage,
  set onmessage(listener: any) {
    onmessage(listener)
  },
  close,
}))
vi.stubGlobal('BroadcastChannel', broadcastChannelMock)

describe('init', () => {
  it('returns initial state', () => {
    let state = broadcastChannelMiddlewareYobta({ channel: 'yobta' }).initial(
      'yobta',
    )
    expect(state).toBe('yobta')
  })
  it('does not open the channel without a need', () => {
    broadcastChannelMiddlewareYobta({ channel: 'yobta' }).initial('yobta')
    expect(broadcastChannelMock).not.toHaveBeenCalled()
  })
})

describe('next', () => {
  it('creates and destroys channel when not observed', () => {
    let channel = broadcastChannelMiddlewareYobta({ channel: 'yobta' })
    channel.next('yobta')

    expect(broadcastChannelMock).toHaveBeenCalledTimes(1)
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify('yobta'))
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('does not create and destroy channel when observed', () => {
    let channel = broadcastChannelMiddlewareYobta({ channel: 'yobta' })
    let unobserve = channel.observe(observer)
    expect(broadcastChannelMock).toHaveBeenCalledTimes(1)

    channel.next('yobta')

    expect(broadcastChannelMock).toHaveBeenCalledTimes(1)
    expect(close).not.toHaveBeenCalled()

    unobserve()
    expect(close).toHaveBeenCalledTimes(1)
  })
})

describe('observe', () => {
  it('creates channel, adds observer, and returns unobserver', () => {
    let channel = broadcastChannelMiddlewareYobta({ channel: 'yobta' })
    let unobserve = channel.observe(observer)

    expect(broadcastChannelMock).toHaveBeenCalledTimes(1)
    expect(onmessage).toHaveBeenCalledTimes(1)
    expect(postMessage).not.toHaveBeenCalled()
    expect(observer).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()

    onmessage.mock.calls[0][0]({ data: JSON.stringify('yobta') })

    expect(observer).toHaveBeenCalledWith('yobta')

    unobserve()

    expect(close).toHaveBeenCalledTimes(1)
  })
})

describe('encoder', () => {
  let encoder = {
    encode: vi.fn(),
    decode: vi.fn(),
  }
  it('does not decode initial', () => {
    broadcastChannelMiddlewareYobta({ channel: 'yobta', encoder }).initial(
      'yobta',
    )
    expect(encoder.encode).not.toHaveBeenCalled()
    expect(encoder.decode).not.toHaveBeenCalled()
  })
  it('encodes next', () => {
    broadcastChannelMiddlewareYobta({ channel: 'yobta', encoder }).next('yobta')
    expect(encoder.encode).toHaveBeenCalledTimes(1)
    expect(encoder.decode).not.toHaveBeenCalled()
  })
  it('decodes onmesage', () => {
    let unobserve = broadcastChannelMiddlewareYobta({
      channel: 'yobta',
      encoder,
    }).observe(observer)

    onmessage.mock.calls[0][0]({ data: JSON.stringify('yobta') })

    expect(observer).toHaveBeenCalledTimes(1)

    unobserve()
  })
})
