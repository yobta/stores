import { StorePlugin } from '../observableYobta/index.js'
import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { BackEndFactoryProps } from '../util/BackEndYobta/index.js'
import { broadcastChannelMiddlewareYobta } from './broadcastChannelMiddlewareYobta.js'

interface BackendWrapper {
  <State>(props: BackEndFactoryProps): StorePlugin<State>
}

export const broadcastChannelPluginYobta: BackendWrapper = (...args) => {
  let backend = broadcastChannelMiddlewareYobta(...args)
  return replicatedYobta(backend)
}
