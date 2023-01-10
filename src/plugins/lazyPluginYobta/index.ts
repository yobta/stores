import { YOBTA_IDLE, YobtaStorePlugin } from '../../stores/storeYobta/index.js'

/**
 * A plugin for the @yobta/stores that resets the store to its initial state when the store is idle.
 * @example
 * const store = storeYobta('initial state', lazyPluginYobta),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/lazyPluginYobta/index.md}.
 */
export const lazyPluginYobta: YobtaStorePlugin<any, any[]> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
