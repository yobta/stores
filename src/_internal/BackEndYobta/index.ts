import { YobtaEncoder } from '../../encoderYobta/index.js'

export type PubSubSubscriber = (message: any) => void

export interface BackEndFactory {
  (props: { channel: string; encoder?: YobtaEncoder }): {
    initial: <State>(state: State) => State
    next(message: any): void
    observe(subscriber: PubSubSubscriber): VoidFunction
  }
}

export type BackEndYobta = ReturnType<BackEndFactory>
