import { lazyPluginYobta } from './index.js'

const addMiddleware = vi.fn()
const next = vi.fn()
const last = vi.fn()
const initialState = 1

it('alls addMiddleware with idle and a function when lazyPluginYobta is called', () => {
  lazyPluginYobta({ addMiddleware, initialState, next, last })

  expect(addMiddleware).toHaveBeenCalledWith('idle', expect.any(Function))
})

it('resets the state to the initial value when the idle middleware is called', () => {
  lazyPluginYobta({ addMiddleware, initialState, next, last })

  let idle = addMiddleware.mock.calls[0][1]

  expect(idle(2)).toEqual(1)
})

it('does not call the next function when lazyPluginYobta is called', () => {
  lazyPluginYobta({ addMiddleware, initialState, next, last })

  expect(next).not.toHaveBeenCalled()
})
