import { StorePlugin } from '../observableYobta/index.js'
import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { BackEndFactoryProps } from '../util/BackEndYobta/index.js'
import { sessionStorageMiddleware } from './sessionStorageMiddleware.js'

interface BackendWrapper {
  <State>(props: BackEndFactoryProps): StorePlugin<State>
}

export const sessionStoragePluginYobta: BackendWrapper = (...args) => {
  let backend = sessionStorageMiddleware(...args)
  return replicatedYobta(backend)
}
