import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): YobtaStorePlugin<State, never>
}

/**
 * A plugin for @yobta/stores that ensures state integrity by validating it during transitions.
 * @example
 * const store = storeYobta(
 *  0,
 *  validationPluginYobta(state => Math.max(0, state))
 * ),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/validationPluginYobta/index.md}.
 */
export const validationPluginYobta: ValidationPluginFactory =
  validate =>
  ({ addMiddleware, initialState }) => {
    let validateWithFallBack = (state: any): typeof initialState => {
      try {
        return validate(state)
      } catch (_) {
        return initialState
      }
    }
    addMiddleware(YOBTA_READY, validateWithFallBack)
    addMiddleware(YOBTA_IDLE, validateWithFallBack)
    addMiddleware(YOBTA_NEXT, validateWithFallBack)
  }
