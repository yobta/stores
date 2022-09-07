import { READY, IDLE, NEXT, StorePlugin } from '../index.js'
import { PubSubYobta } from '../_internal/PubSubYobta/index.js'

interface BackendConfig<S> {
  channel: string
  backend: PubSubYobta
  validate?: (message: any) => S
}

interface ReplicatedYobta {
  <S>(config: BackendConfig<S>): StorePlugin<any>
}

export const replicatedYobta: ReplicatedYobta = ({
  backend,
  channel,
  validate,
}) => {
  let unsubscribe: VoidFunction
  return ({ addMiddleware }) => {
    addMiddleware(READY, state => {
      unsubscribe = backend.subscribe(channel, message => {
        let validatedState = validate ? validate(message) : message
        return validatedState
      })
      return state
    })
    addMiddleware(IDLE, () => {
      unsubscribe()
    })
    addMiddleware(NEXT, state => {
      backend.publish(channel, state)
      return state
    })
  }
}
