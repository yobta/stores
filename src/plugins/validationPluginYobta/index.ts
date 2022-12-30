import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): YobtaStorePlugin<State, never>
}

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
