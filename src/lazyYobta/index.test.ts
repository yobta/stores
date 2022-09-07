import { lazyYobta } from './index.js'

const addMiddleware = vi.fn()
const initialState = 1

it('adds middleware', () => {
  lazyYobta({ addMiddleware, initialState })

  expect(addMiddleware).toHaveBeenCalledWith('idle', expect.any(Function))
})

it('resets to initial state when idle', () => {
  lazyYobta({ addMiddleware, initialState })

  let idle = addMiddleware.mock.calls[0][1]

  expect(idle(2)).toEqual(1)
})
