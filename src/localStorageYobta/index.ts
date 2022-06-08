import { decodeYobta, encodeYobta } from '../encoderYobta/index.js'
import {
  PubSubSubscriber,
  PubSubYobta,
} from '../_internal/PubSubYobta/index.js'

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
type Subscriptions = Record<string, PubSubSubscriber[]>

let subscriptions: Subscriptions = {}
let size = 0

function handleStorage({ key, newValue }: StorageEvent): void {
  if (key !== null) {
    let decoded = decodeYobta(newValue)
    let subscribers = subscriptions[key] || []
    subscribers.forEach(send => {
      send(decoded)
    })
  }
}

export const localStorageYobta: PubSubYobta = {
  publish(channel: string, message: any) {
    let encodedMessage = encodeYobta(message)
    localStorage.setItem(channel, encodedMessage)
  },
  subscribe(channel: string, next: PubSubSubscriber) {
    if (!size) {
      window.addEventListener('storage', handleStorage)
    }
    if (!(channel in subscriptions)) {
      subscriptions[channel] = []
    }

    let subscribers = subscriptions[channel]
    subscribers.push(next)

    let item = localStorage.getItem(channel)
    let decoded = decodeYobta(item)
    next(decoded)

    size++

    return () => {
      let index = subscribers.indexOf(next)
      subscribers.splice(index, 1)

      size--

      if (!size) {
        window.removeEventListener('storage', handleStorage)
      }
    }
  },
}
