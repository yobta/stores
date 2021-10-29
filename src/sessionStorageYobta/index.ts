import { decode, encode } from '../_internal/jsonEncoder'
import { PubSubSubscriber, PubSubYobta } from '../_internal/PubSubYobta'

export const sessionStorageYobta: PubSubYobta = {
  publish(channel: string, message: any) {
    let encodedMessage = encode(message)
    sessionStorage.setItem(channel, encodedMessage)
  },
  subscribe(channel: string, next: PubSubSubscriber) {
    let item = sessionStorage.getItem(channel)
    let decoded = decode(item)
    next(decoded)

    return () => {}
  },
}
