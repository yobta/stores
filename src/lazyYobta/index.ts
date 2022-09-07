import { IDLE, StorePlugin } from '../observableYobta/index.js'

export const lazyYobta: StorePlugin<any> = ({
  addMiddleware,
  initialState,
}) => {
  addMiddleware(IDLE, () => initialState)
}
