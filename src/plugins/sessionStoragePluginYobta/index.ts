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
} from '../../stores/createStore/index.js'

interface SessionStoragePluginFactory {
  <State, Codec extends YobtaGenericCodec<State>>(
    props: State extends YobtaJsonValue
      ? { channel: string; codec?: YobtaSimpleCodec }
      : {
          channel: string
          codec: Codec
        },
  ): YobtaStorePlugin<State, any[]>
}

/**
 * A plugin for @yobta/stores that persists store state in session storage.
 * @example
 * const store = createStore(
 *  'initial state',
 *  sessionStoragePluginYobta({
 *     channel: 'my-store-yobta',
 *  })
 * ),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/sessionStoragePluginYobta/index.md}.
 */
export const sessionStoragePluginYobta: SessionStoragePluginFactory =
  ({ channel, codec = codecYobta }) =>
  ({ addMiddleware }) => {
    let write = <State>(state: State): State => {
      let encodedMessage = codec.encode(state as any)
      sessionStorage.setItem(channel, encodedMessage)
      return state
    }
    addMiddleware(YOBTA_READY, state => {
      let item = sessionStorage.getItem(channel)
      return codec.decode(item, () => state)[0]
    })
    addMiddleware(YOBTA_IDLE, write)
    addMiddleware(YOBTA_NEXT, write)
  }
