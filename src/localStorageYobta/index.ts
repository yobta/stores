import { decode, encode } from '../_internal/jsonEncoder'
import { PubSubSubscriber, PubSubYobta } from '../_internal/PubSubYobta'

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
type Subscriptions = Record<string, PubSubSubscriber[]>

let subscriptions: Subscriptions = {}
let size = 0

function handleStorage({ key, newValue }: StorageEvent): void {
  if (key !== null) {
    let decoded = decode(newValue)
    let subscribers = subscriptions[key] || []
    subscribers.forEach(send => {
      send(decoded)
    })
  }
}

export const localStorageYobta: PubSubYobta = {
  publish(channel: string, message: any) {
    let encodedMessage = encode(message)
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
    let decoded = decode(item)
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
