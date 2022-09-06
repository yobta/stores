import { lazyYobta } from './index.js'

const spy = vi.fn()

it('adds middleware', () => {
  lazyYobta(spy)

  expect(spy).toHaveBeenCalledWith('init', expect.any(Function))
  expect(spy).toHaveBeenCalledWith('idle', expect.any(Function))
})

it('returns same state for init', () => {
  lazyYobta(spy)

  let init = spy.mock.calls[0][1]
  expect(init('test')).toEqual('test')
})

it('resets to initial state when idle', () => {
  lazyYobta(spy)

  let init = spy.mock.calls[0][1]
  let idle = spy.mock.calls[1][1]

  init(1)
  expect(idle(2)).toEqual(1)
})
