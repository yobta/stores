import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { sessionStorageMiddleware } from './sessionStorageMiddleware.js'
import { sessionStoragePluginYobta } from './index.js'

vi.mock('./sessionStorageMiddleware.js', () => ({
  sessionStorageMiddleware: vi.fn(),
}))
vi.mock('../util/replicatedYobta/index.js', () => ({
  replicatedYobta: vi.fn(),
}))

it('creates middleware and wraps it', () => {
  let args = { channel: 'yobta' }
  sessionStoragePluginYobta(args)

  expect(sessionStorageMiddleware).toHaveBeenCalledTimes(1)
  expect(sessionStorageMiddleware).toHaveBeenCalledWith(args)
  expect(replicatedYobta).toHaveBeenCalledTimes(1)
})
