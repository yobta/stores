import { YOBTA_READY, YOBTA_IDLE, YOBTA_NEXT, StorePlugin } from '../index.js'
import { PubSubYobta } from '../_internal/PubSubYobta/index.js'

interface BackendConfig<S> {
  channel: string
  backend: PubSubYobta
  validate?: (message: any) => S
}

interface ReplicatedYobta {
  <S>(config: BackendConfig<S>): StorePlugin<S>
}

export const replicatedYobta: ReplicatedYobta =
  ({ backend, channel, validate }) =>
  ({ addMiddleware }) => {
    let unsubscribe: VoidFunction
    addMiddleware(YOBTA_READY, state => {
      unsubscribe = backend.subscribe(channel, message => {
        let validatedState = validate ? validate(message) : message
        return validatedState
      })
      return state
    })
    addMiddleware(YOBTA_IDLE, state => {
      unsubscribe()
      return state
    })
    addMiddleware(YOBTA_NEXT, state => {
      backend.publish(channel, state)
      return state
    })
  }
