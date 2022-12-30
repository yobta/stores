import { codecYobta, YobtaCodec } from '../../util/codecYobta/index.js'
import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface StorageListener {
  (event: StorageEvent): void
}

interface LocalStorageFactory {
  <State, Overloads extends any[] = any[]>(props: {
    channel: string
    codec?: YobtaCodec
  }): YobtaStorePlugin<State, Overloads>
}

/**
 * A factory function for creating a YobtaStorePlugin that syncs the state with localStorage.
 * @param {Object} props - The properties for the plugin.
 * @param {string} props.channel - The key in localStorage to use for storing the state.
 * @param {YobtaCodec} [props.codec=codecYobta] - The codec to use for serializing and deserializing the state.
 * @returns {YobtaStorePlugin<State>} - The created YobtaStorePlugin.
 */
export const localStoragePluginYobta: LocalStorageFactory =
  ({ channel, codec = codecYobta }) =>
  ({ addMiddleware, next, last }) => {
    let onMessage: StorageListener = ({ key, newValue }) => {
      if (key === channel) {
        let [message, ...overloads] = codec.decode(newValue, last)
        next(message, ...(overloads as any))
      }
    }
    let write = (item: any, ...overloads: any[]): void => {
      let encodedMessage = codec.encode(item, ...overloads)
      localStorage.setItem(channel, encodedMessage)
    }
    addMiddleware(YOBTA_READY, state => {
      let item = localStorage.getItem(channel)
      window.addEventListener('storage', onMessage)
      return codec.decode(item, () => state)[0]
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
