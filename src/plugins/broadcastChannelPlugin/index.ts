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

interface BroadcastChannelFactory {
  <
    State,
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
 * A plugin for @yobta/stores that allows them to receive state updates from other instances of the same store using the browser's BroadcastChannel API.
 * @example
 * const store = createStore(
 *  'initial state',
 *  broadcastChannelPlugin({ channel: 'my-store' })
 * ),
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/plugins/broadcastChannelPlugin/index.md}.
 */
export const broadcastChannelPlugin: BroadcastChannelFactory =
  ({ channel, codec = jsonCodec }) =>
  ({ addMiddleware, next, last }) => {
    let bc: BroadcastChannel | null
    let shouldMute: boolean
    let open = (): BroadcastChannel => {
      if (!bc) bc = new BroadcastChannel(channel)
      return bc
    }
    let close: VoidFunction = () => {
      if (bc) {
        bc.close()
        bc = null
      }
    }
    addMiddleware(YOBTA_READY, state => {
      open().onmessage = ({ data }) => {
        let [message, ...overloads] = codec.decode(data, last)
        shouldMute = true
        next(message, ...(overloads as any))
      }
      return state
    })
    addMiddleware(YOBTA_IDLE, state => {
      close()
      return state
    })
    addMiddleware(YOBTA_NEXT, (state, ...overloads) => {
      let shouldClose = !bc
      if (shouldMute) {
        shouldMute = false
      } else {
        let encodedMessage = codec.encode(state as any, ...overloads)
        open().postMessage(encodedMessage)
        if (shouldClose) close()
      }
      return state
    })
  }
