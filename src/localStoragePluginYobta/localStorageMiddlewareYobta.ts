import { encoderYobta } from '../util/encoderYobta/index.js'
import { PubSubSubscriber, BackEndFactory } from '../util/BackEndYobta/index.js'

interface StorageListener {
  (event: StorageEvent): void
}

export const localStorageMiddlewareYobta: BackEndFactory = ({
  channel,
  encoder = encoderYobta,
}) => {
  return {
    ready(state) {
      let item = localStorage.getItem(channel)
      return item === null ? state : encoder.decode<any[]>(item)[0]
    },
    next(...args) {
      let encodedMessage = encoder.encode(args)
      localStorage.setItem(channel, encodedMessage)
    },
    observe(next: PubSubSubscriber) {
      let onMessage: StorageListener = ({ key, newValue }) => {
        if (key === channel) {
          let [message, ...overloads] = encoder.decode<any[]>(newValue)
          next(message, ...overloads)
        }
      }
      window.addEventListener('storage', onMessage)

      return () => {
        window.removeEventListener('storage', onMessage)
      }
    },
  }
}
