import { YOBTA_IDLE, StorePlugin } from '../../stores/storeYobta/index.js'

export const lazyPluginYobta: StorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
