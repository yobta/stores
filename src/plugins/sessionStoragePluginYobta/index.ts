import { encoderYobta, YobtaEncoder } from '../../util/encoderYobta/index.js'
import {
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

interface SessionStoragePluginFactory {
  <State>(props: {
    channel: string
    encoder?: YobtaEncoder
  }): YobtaStorePlugin<State>
}

export const sessionStoragePluginYobta: SessionStoragePluginFactory =
  ({ channel, encoder = encoderYobta }) =>
  ({ addMiddleware }) => {
    let write = (state: any): any => {
      let encodedMessage = encoder.encode(state)
      sessionStorage.setItem(channel, encodedMessage)
      return state
    }

    addMiddleware(YOBTA_READY, state => {
      let item = sessionStorage.getItem(channel)
      return encoder.decode(item, () => state)[0]
    })
    addMiddleware(YOBTA_IDLE, write)
    addMiddleware(YOBTA_NEXT, write)
  }
