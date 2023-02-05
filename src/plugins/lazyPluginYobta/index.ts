import { YOBTA_IDLE, YobtaStorePlugin } from '../../stores/createStore/index.js'

/**
 * A plugin for the @yobta/stores that resets the store to its initial state when the store is idle.
 * @example
 * const store = createStore('initial state', lazyPluginYobta),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/lazyPluginYobta/index.md}.
 */
export const lazyPluginYobta: YobtaStorePlugin<any, never> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
