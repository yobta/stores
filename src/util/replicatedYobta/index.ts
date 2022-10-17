import {
  YOBTA_READY,
  YOBTA_IDLE,
  YOBTA_NEXT,
  StorePlugin,
} from '../../index.js'
import { BackEndYobta } from '../BackEndYobta/index.js'

interface ReplicatedFactory {
  <S>(backend: BackEndYobta): StorePlugin<S>
}

export const replicatedYobta: ReplicatedFactory =
  backend =>
  ({ addMiddleware, next }) => {
    let unsubscribe: VoidFunction | undefined
    addMiddleware(YOBTA_READY, state => {
      unsubscribe = backend.observe(next)
      return backend.ready(state)
    })
    addMiddleware(YOBTA_IDLE, state => {
      if (unsubscribe) {
        unsubscribe()
      }
      return state
    })
    addMiddleware(YOBTA_NEXT, (state, ...args) => {
      backend.next(state, ...args)
      return state
    })
  }
