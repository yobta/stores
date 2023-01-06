import {
  codecYobta,
  YobtaGenericCodec,
  YobtaJsonValue,
  YobtaSimpleCodec,
} from '../../util/codecYobta/index.js'
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
  <
    State extends any,
    Codec extends YobtaGenericCodec<State>,
    Overloads extends any[] = any[],
  >(
    props: State extends YobtaJsonValue
      ? { channel: string; codec?: YobtaSimpleCodec }
      : {
          channel: string
          codec: Codec
        },
  ): YobtaStorePlugin<State, Overloads>
}

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
