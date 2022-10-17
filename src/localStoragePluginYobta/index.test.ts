import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { localStorageMiddlewareYobta } from './localStorageMiddlewareYobta.js'
import { localStoragePluginYobta } from './index.js'

vi.mock('./localStorageMiddlewareYobta.js', () => ({
  localStorageMiddlewareYobta: vi.fn(),
}))
vi.mock('../util/replicatedYobta/index.js', () => ({
  replicatedYobta: vi.fn(),
}))

it('creates middleware and wraps it', () => {
  let args = { channel: 'yobta' }
  localStoragePluginYobta(args)

  expect(localStorageMiddlewareYobta).toHaveBeenCalledTimes(1)
  expect(localStorageMiddlewareYobta).toHaveBeenCalledWith(args)
  expect(replicatedYobta).toHaveBeenCalledTimes(1)
})
