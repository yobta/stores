import { codecYobta, YobtaCodec } from '../../util/codecYobta/index.js'
import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface BroadcastChannelFactory {
  <State>(props: {
    channel: string
    codec?: YobtaCodec
  }): YobtaStorePlugin<State>
}

/**
 * A plugin for @yobta/stores that allows them synchronize their states with other instances of the same store
 * using the browser's BroadcastChannel API.
 *
 * @param {Object} options - The options for the plugin.
 * @param {string} options.channel - The name of the channel to use for communication.
 * @param {YobtaCodec} [options.codec=codecYobta] - The codec to use for encoding and decoding
 * messages. Defaults to the `codecYobta` provided in `util/codecYobta/index.js`.
 *
 * @returns {YobtaStorePlugin} A Yobta store plugin that can be passed to the store factory when creating a store.
 */
export const broadcastChannelPluginYobta: BroadcastChannelFactory =
  ({ channel, codec = codecYobta }) =>
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
        next(message, ...overloads)
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
        let encodedMessage = codec.encode(state, ...overloads)
        open().postMessage(encodedMessage)
        if (shouldClose) close()
      }
      return state
    })
  }
