/* eslint-disable @typescript-eslint/no-unnecessary-condition */
type Subscriber = (message: any) => void
type Subscriptions = Record<string, Subscriber[]>

export interface PubSubYobta {
  publish(channel: string, message: any): void
  subscribe(channel: string, subscriber: Subscriber): VoidFunction
}

function encode(item: any): string {
  return JSON.stringify(item)
}

function decode(item: string | null): unknown {
  if (item === null) {
    return null
  }
  return JSON.parse(item)
}

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

export const storageYobta: PubSubYobta = {
  publish(channel: string, message: any) {
    let encodedMessage = encode(message)
    localStorage.setItem(channel, encodedMessage)
  },
  subscribe(channel: string, next: Subscriber) {
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
