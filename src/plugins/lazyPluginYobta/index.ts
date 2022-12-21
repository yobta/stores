import { YOBTA_IDLE, YobtaStorePlugin } from '../../stores/storeYobta/index.js'

/**
 * A plugin for the @yobta/stores package that adds an idle middleware that
 * resets the state to the initial value when the last observer leaves.
 *
 * @param {Object} options - The options for the plugin.
 * @param {Function} options.addMiddleware - A function for adding middleware to the store.
 * @param {any} options.initialState - The initial state of the store.
 * @returns {void}
 */
export const lazyPluginYobta: YobtaStorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
