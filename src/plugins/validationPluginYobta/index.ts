import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

/**
 * An interface for a validation plugin factory.
 * @template State
 * @param {function(input: any): State} validate - A function that validates the input and returns a state.
 */
interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): YobtaStorePlugin<State>
}

/**
 * A validation plugin factory for @yobta/stores.
 * @type {ValidationPluginFactory}
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
