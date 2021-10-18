import { StoreFactoryEvent } from '../observableYobta'

interface LazyYobta {
  <S>(event: StoreFactoryEvent<S>): void
}

export const lazyYobta: LazyYobta = ({ type, initialState, next }) => {
  if (type === 'STOP') {
    next(initialState)
  }
}
