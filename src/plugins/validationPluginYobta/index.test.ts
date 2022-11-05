import {
  YOBTA_IDLE,
  YOBTA_INIT,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/observableYobta/index.js'
import { validationPluginYobta } from './index.js'

let mock = vi.fn()

let validate = (state: any): any => {
  mock(state)
  return state
}

const params = {
  addMiddleware: vi.fn(),
  next: vi.fn(),
  initialState: 'yobta',
}

it('adds middleware', () => {
  validationPluginYobta(validate)(params)
  expect(params.addMiddleware).toBeCalledTimes(4)
  expect(params.addMiddleware).toBeCalledWith(YOBTA_INIT, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_READY, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_IDLE, expect.any(Function))
  expect(params.addMiddleware).toBeCalledWith(YOBTA_NEXT, expect.any(Function))
})

it('validates store events', () => {
  validationPluginYobta(validate)(params)

  expect(params.addMiddleware.mock.calls[0][1]('init')).toBe('init')
  expect(mock).toHaveBeenCalledWith('init')

  expect(params.addMiddleware.mock.calls[1][1]('ready')).toBe('ready')
  expect(mock).toHaveBeenCalledWith('ready')

  expect(params.addMiddleware.mock.calls[2][1]('idle')).toBe('idle')
  expect(mock).toHaveBeenCalledWith('idle')

  expect(params.addMiddleware.mock.calls[3][1]('next')).toBe('next')
  expect(mock).toHaveBeenCalledWith('next')
})