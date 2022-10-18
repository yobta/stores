import { YOBTA_IDLE, StorePlugin } from '../../stores/observableYobta/index.js'

export const lazyPluginYobta: StorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
