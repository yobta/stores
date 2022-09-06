import {
  IDLE,
  INIT,
  StoreEvent,
  StoreMiddleware,
} from '../observableYobta/index.js'

interface LazyPlugin {
  <State>(
    addMiddleware: (
      type: StoreEvent,
      middleware: StoreMiddleware<State>,
    ) => void,
  ): void
}

export const lazyYobta: LazyPlugin = addMiddleware => {
  let initialSate: any
  addMiddleware(INIT, state => {
    initialSate = state
    return state
  })
  addMiddleware(IDLE, () => {
    return initialSate
  })
}
