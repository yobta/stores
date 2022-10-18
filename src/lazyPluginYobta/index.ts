import { YOBTA_IDLE, StorePlugin } from '../observableYobta/index.js'

export const lazyPluginYobta: StorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
