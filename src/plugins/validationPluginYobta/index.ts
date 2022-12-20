import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface ValidationPluginFactory {
  <State>(validate: (input: any) => State): YobtaStorePlugin<State>
}

export const validationPluginYobta: ValidationPluginFactory =
  validate =>
  ({ addMiddleware }) => {
    addMiddleware(YOBTA_READY, validate)
    addMiddleware(YOBTA_IDLE, validate)
    addMiddleware(YOBTA_NEXT, validate)
  }
