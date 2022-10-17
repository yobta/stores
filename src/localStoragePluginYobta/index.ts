import { StorePlugin } from '../observableYobta/index.js'
import { replicatedYobta } from '../util/replicatedYobta/index.js'
import { BackEndFactoryProps } from '../util/BackEndYobta/index.js'
import { localStorageMiddlewareYobta } from './localStorageMiddlewareYobta.js'

interface BackendWrapper {
  <State>(props: BackEndFactoryProps): StorePlugin<State>
}

export const localStoragePluginYobta: BackendWrapper = (...args) => {
  let backend = localStorageMiddlewareYobta(...args)
  return replicatedYobta(backend)
}
