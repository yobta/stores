import { lazyPluginYobta } from './index.js'

const addMiddleware = vi.fn()
const next = vi.fn()
const initialState = 1

it('adds middleware', () => {
  lazyPluginYobta({ addMiddleware, initialState, next })

  expect(addMiddleware).toHaveBeenCalledWith('idle', expect.any(Function))
})

it('resets to initial state when idle', () => {
  lazyPluginYobta({ addMiddleware, initialState, next })

  let idle = addMiddleware.mock.calls[0][1]

  expect(idle(2)).toEqual(1)
})

it("doesn't call next", () => {
  lazyPluginYobta({ addMiddleware, initialState, next })

  expect(next).not.toHaveBeenCalled()
})
