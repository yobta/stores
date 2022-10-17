import { encoderYobta } from '../encoderYobta/index.js'
import {
  PubSubSubscriber,
  BackEndFactory,
} from '../_internal/BackEndYobta/index.js'

interface StorageListener {
  (event: StorageEvent): void
}

export const localStorageYobta: BackEndFactory = ({
  channel,
  encoder = encoderYobta,
}) => {
  return {
    initial(state) {
      let item = localStorage.getItem(channel)
      return item === null ? state : encoder.decode(item)
    },
    next(message: any) {
      let encodedMessage = encoder.encode(message)
      localStorage.setItem(channel, encodedMessage)
    },
    observe(next: PubSubSubscriber) {
      let onMessage: StorageListener = ({ key, newValue }) => {
        if (key === channel) {
          let decoded = encoder.decode(newValue)
          next(decoded)
        }
      }
      window.addEventListener('storage', onMessage)

      return () => {
        window.removeEventListener('storage', onMessage)
      }
    },
  }
}
