import {
  StorePlugin,
  YOBTA_IDLE,
  YOBTA_INIT,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/observableYobta/index.js'

interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): StorePlugin<State>
}

export const validationPluginYobta: ValidationPluginFactory =
  validate =>
  ({ addMiddleware }) => {
    addMiddleware(YOBTA_INIT, validate)
    addMiddleware(YOBTA_READY, validate)
    addMiddleware(YOBTA_IDLE, validate)
    addMiddleware(YOBTA_NEXT, validate)
  }
