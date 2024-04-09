import {
  jsonCodec,
  YobtaGenericCodec,
  YobtaJsonValue,
  YobtaSimpleCodec,
} from '../../util/jsonCodec/index.js'
import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/createStore/index.js'

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

/**
 * A plugin for @yobta/stores that persists store state in local storage and synchronizes state across multiple browser tabs.
 * @example
 * const store = createStore(
 *  'initial state',
 *  localStoragePlugin({
 *     channel: 'my-store-yobta',
 *  })
 * ),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/localStoragePlugin/index.md}.
 */
export const localStoragePlugin: LocalStorageFactory =
  ({ channel, codec = jsonCodec }) =>
  ({ addMiddleware, next, last }) => {
    const onMessage: StorageListener = ({ key, newValue }) => {
      if (key === channel) {
        const [message, ...overloads] = codec.decode(newValue, last)
        next(message, ...(overloads as any))
      }
    }
    const write = (item: any, ...overloads: any[]): void => {
      const encodedMessage = codec.encode(item, ...overloads)
      localStorage.setItem(channel, encodedMessage)
    }
    addMiddleware(YOBTA_READY, state => {
      const item = localStorage.getItem(channel)
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
