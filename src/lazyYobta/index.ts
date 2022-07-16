import { StoreEvent } from '../observableYobta/index.js'

interface LazyYobta {
  <State>(event: StoreEvent<State>): void
}

export const lazyYobta: LazyYobta = ({ type, initialState, next }) => {
  if (type === 'IDLE') {
    next(initialState)
  }
}
