import { YOBTA_IDLE, YobtaStorePlugin } from '../../stores/createStore/index.js'

/**
 * A plugin for the @yobta/stores that resets the store to its initial state when the store is idle.
 * @example
 * const store = createStore('initial state', lazyPlugin),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/lazyPlugin/index.md}.
 */
export const lazyPlugin: YobtaStorePlugin<any, any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
