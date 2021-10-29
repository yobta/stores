export type PubSubSubscriber = (message: any) => void

export interface PubSubYobta {
  publish(channel: string, message: any): void
  subscribe(channel: string, subscriber: PubSubSubscriber): VoidFunction
}
