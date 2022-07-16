import { StorePlugin } from '../index.js'
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
  return ({ type, next, last }) => {
    switch (type) {
      case 'READY':
        unsubscribe = backend.subscribe(channel, message => {
          let state = validate ? validate(message) : message
          next(state)
        })
        break
      case 'IDLE':
        unsubscribe()
        break
      case 'NEXT':
        backend.publish(channel, last())
        break
    }
  }
}
