import { encoderYobta, YobtaEncoder } from '../util/encoderYobta/index.js'
import {
  StorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../observableYobta/index.js'

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
  ({ addMiddleware, next }) => {
    let onMessage: StorageListener = ({ key, newValue }) => {
      if (key === channel) {
        let [message, ...overloads] = encoder.decode<any[]>(newValue)
        next(message, ...overloads)
      }
    }

    let write = (...args: any[]): void => {
      let encodedMessage = encoder.encode(args)
      localStorage.setItem(channel, encodedMessage)
    }

    addMiddleware(YOBTA_READY, state => {
      let item = localStorage.getItem(channel)
      window.addEventListener('storage', onMessage)
      return item === null ? state : encoder.decode<any[]>(item)[0]
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
