import { encoderYobta, YobtaEncoder } from '../../util/encoderYobta/index.js'
import {
  StorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../stores/observableYobta/index.js'

interface BroadcastChannelFactory {
  <State>(props: {
    channel: string
    encoder?: YobtaEncoder
  }): StorePlugin<State>
}

export const broadcastChannelPluginYobta: BroadcastChannelFactory =
  ({ channel, encoder = encoderYobta }) =>
  ({ addMiddleware, next, last }) => {
    let bc: BroadcastChannel | null = null
    let shouldMute: boolean = false

    let open = (): BroadcastChannel => {
      if (!bc) {
        bc = new BroadcastChannel(channel)
      }
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
        let [message, ...overloads] = encoder.decode(data, last)
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
        let encodedMessage = encoder.encode([state, ...overloads])
        open().postMessage(encodedMessage)
        if (shouldClose) {
          close()
        }
      }
      return state
    })
  }
