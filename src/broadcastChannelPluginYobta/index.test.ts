import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { broadcastChannelMiddlewareYobta } from './broadcastChannelMiddlewareYobta.js'
import { broadcastChannelPluginYobta } from './index.js'

vi.mock('./broadcastChannelMiddlewareYobta.js', () => ({
  broadcastChannelMiddlewareYobta: vi.fn(),
}))
vi.mock('../util/replicatedYobta/index.js', () => ({
  replicatedYobta: vi.fn(),
}))

it('creates middleware and wraps it', () => {
  let args = { channel: 'yobta' }
  broadcastChannelPluginYobta(args)

  expect(broadcastChannelMiddlewareYobta).toHaveBeenCalledTimes(1)
  expect(broadcastChannelMiddlewareYobta).toHaveBeenCalledWith(args)
  expect(replicatedYobta).toHaveBeenCalledTimes(1)
})
