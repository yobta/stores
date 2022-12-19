import { encoderYobta, YobtaEncoder } from '../../util/encoderYobta/index.js'
import {
  StorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface StorageListener {
  (event: StorageEvent): void
}

interface LocalStprageFactory {
  <State>(props: {
    channel: string
    encoder?: YobtaEncoder
  }): StorePlugin<State>
}

export const localStoragePluginYobta: LocalStprageFactory =
  ({ channel, encoder = encoderYobta }) =>
  ({ addMiddleware, next, last }) => {
    let onMessage: StorageListener = ({ key, newValue }) => {
      if (key === channel) {
        let [message, ...overloads] = encoder.decode(newValue, last)
        next(message, ...overloads)
      }
    }

    let write = (item: any, ...overloads: any[]): void => {
      let encodedMessage = encoder.encode(item, ...overloads)
      localStorage.setItem(channel, encodedMessage)
    }

    addMiddleware(YOBTA_READY, state => {
      let item = localStorage.getItem(channel)
      window.addEventListener('storage', onMessage)
      return encoder.decode(item, () => state)[0]
    })
    addMiddleware(YOBTA_IDLE, state => {
      write(state)
      window.removeEventListener('storage', onMessage)
      return state
    })
    addMiddleware(YOBTA_NEXT, (state, ...overloads) => {
      write(state, ...overloads)
      return state
    })
  }
