import { YobtaEncoder } from '../encoderYobta/index.js'

export type PubSubSubscriber = (message: any, ...overloads: any[]) => void

export interface BackEndFactory {
  (props: { channel: string; encoder?: YobtaEncoder }): {
    ready: <State>(state: State) => State
    next(message: any, ...overloads: any[]): void
    observe(subscriber: PubSubSubscriber): VoidFunction
  }
}

export type BackEndFactoryProps = Parameters<BackEndFactory>[0]

export type BackEndYobta = ReturnType<BackEndFactory>
