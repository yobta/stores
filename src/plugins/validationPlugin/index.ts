import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/createStore/index.js'

interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): YobtaStorePlugin<State, any>
}

/**
 * A plugin for @yobta/stores that ensures state integrity by validating it during transitions.
 * @example
 * const store = createStore(
 *  0,
 *  validationPlugin(state => Math.max(0, state))
 * ),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/validationPlugin/index.md}.
 */
export const validationPlugin: ValidationPluginFactory =
  validate =>
  ({ addMiddleware, initialState }) => {
    const validateWithFallBack = (state: any): typeof initialState => {
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
