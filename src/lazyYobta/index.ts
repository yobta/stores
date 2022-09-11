import { YOBTA_IDLE, StorePlugin } from '../observableYobta/index.js'

export const lazyYobta: StorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(YOBTA_IDLE, () => initialState)
}
