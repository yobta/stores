import { codecYobta, YobtaCodec } from '../../util/codecYobta/index.js'
import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface SessionStoragePluginFactory {
  <State>(props: {
    channel: string
    codec?: YobtaCodec
  }): YobtaStorePlugin<State>
}

/**
 * A factory function that creates a plugin for a Yobta store that allows for storing and
 * retrieving the store's state in the browser's session storage.
 *
 * @param {Object} props - An object containing the configuration for the plugin.
 * @param {string} props.channel - The key to use in session storage for storing the state.
 * @param {YobtaCodec} [props.codec=codecYobta] - The codec to use for encoding and decoding
 * the state.
 *
 * @returns {YobtaStorePlugin<State>} A Yobta store plugin that can be used to store and retrieve
 * the store's state in the browser's session storage.
 */
export const sessionStoragePluginYobta: SessionStoragePluginFactory =
  ({ channel, codec = codecYobta }) =>
  ({ addMiddleware }) => {
    let write = (state: any): any => {
      let encodedMessage = codec.encode(state)
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
