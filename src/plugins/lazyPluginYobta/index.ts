import { YOBTA_IDLE, YobtaStorePlugin } from '../../stores/storeYobta/index.js'

export const lazyPluginYobta: YobtaStorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
