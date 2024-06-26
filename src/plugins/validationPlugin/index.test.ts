import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/createStore/index.js'
import { validationPlugin } from './index.js'

const mock = vi.fn()

const validate = (state: any): any => {
  mock(state)
  return state
}

const params = {
  addMiddleware: vi.fn(),
  next: vi.fn(),
  last: vi.fn(),
  initialState: 'yobta',
}

it('adds middleware', () => {
  validationPlugin(validate)(params)
  expect(params.addMiddleware).toBeCalledTimes(3)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('validates store events', () => {
  validationPlugin(validate)(params)

  expect(params.addMiddleware.mock.calls[0][1]('ready')).toBe('ready')
  expect(mock).toHaveBeenCalledWith('ready')

  expect(params.addMiddleware.mock.calls[1][1]('idle')).toBe('idle')
  expect(mock).toHaveBeenCalledWith('idle')

  expect(params.addMiddleware.mock.calls[2][1]('next')).toBe('next')
  expect(mock).toHaveBeenCalledWith('next')
})

it('falls back to initial state if validation fails', () => {
  validationPlugin(validate)(params)

  mock.mockImplementation(() => {
    throw new Error()
  })

  expect(params.addMiddleware.mock.calls[0][1]('ready')).toBe('yobta')
  expect(params.addMiddleware.mock.calls[1][1]('idle')).toBe('yobta')
  expect(params.addMiddleware.mock.calls[2][1]('next')).toBe('yobta')
})
