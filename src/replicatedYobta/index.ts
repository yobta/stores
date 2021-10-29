import { StoreListener } from '..'
import { PubSubYobta } from '../_internal/PubSubYobta'

interface BackendConfig<S> {
  channel: string
  backend: PubSubYobta
  validate?: (message: any) => S
}

interface ReplicatedYobta {
  <S>(config: BackendConfig<S>): StoreListener<any>
}

export const replicatedYobta: ReplicatedYobta = ({
  backend,
  channel,
  validate,
}) => {
  let unsubscribe: VoidFunction
  return ({ type, next, last }) => {
    switch (type) {
      case 'START':
        unsubscribe = backend.subscribe(channel, message => {
          let state = validate ? validate(message) : message
          next(state)
        })
        break
      case 'STOP':
        // @ts-ignore
        unsubscribe()
        break
      case 'NEXT':
        backend.publish(channel, last())
        break
    }
  }
}
