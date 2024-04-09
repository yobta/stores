import { lazyPlugin } from './index.js'

const addMiddleware = vi.fn()
const next = vi.fn()
const last = vi.fn()
const initialState = 1

it('alls addMiddleware with idle and a function when lazyPlugin is called', () => {
  lazyPlugin({ addMiddleware, initialState, next, last })

  expect(addMiddleware).toHaveBeenCalledWith('idle', expect.any(Function))
})

it('resets the state to the initial value when the idle middleware is called', () => {
  lazyPlugin({ addMiddleware, initialState, next, last })

  const idle = addMiddleware.mock.calls[0][1]

  expect(idle(2)).toEqual(1)
})

it('does not call the next function when lazyPlugin is called', () => {
  lazyPlugin({ addMiddleware, initialState, next, last })

  expect(next).not.toHaveBeenCalled()
})
