import { decodeYobta, encodeYobta } from '../encoderYobta/index.js'
import {
  PubSubSubscriber,
  PubSubYobta,
} from '../_internal/PubSubYobta/index.js'

export const sessionStorageYobta: PubSubYobta = {
  publish(channel: string, message: any) {
    let encodedMessage = encodeYobta(message)
    sessionStorage.setItem(channel, encodedMessage)
  },
  subscribe(channel: string, next: PubSubSubscriber) {
    let item = sessionStorage.getItem(channel)
    let decoded = decodeYobta(item)
    next(decoded)

    return () => {}
  },
}
