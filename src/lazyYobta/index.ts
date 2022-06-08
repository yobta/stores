import { StoreEvent } from '../observableYobta/index.js'

interface LazyYobta {
  <S>(event: StoreEvent<S>): void
}

export const lazyYobta: LazyYobta = ({ type, initialState, next }) => {
  if (type === 'STOP') {
    next(initialState)
  }
}
