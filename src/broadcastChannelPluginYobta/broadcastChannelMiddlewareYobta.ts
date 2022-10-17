import { encoderYobta } from '../util/encoderYobta/index.js'
import { BackEndFactory } from '../util/BackEndYobta/index.js'

export const broadcastChannelMiddlewareYobta: BackEndFactory = ({
  channel,
  encoder = encoderYobta,
}) => {
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

  return {
    ready: state => state,
    next(...args) {
      let shouldClose = !bc
      let encodedMessage = encoder.encode(args)
      if (shouldMute) {
        shouldMute = false
      } else {
        open().postMessage(encodedMessage)
        if (shouldClose) {
          close()
        }
      }
    },
    observe(next) {
      open().onmessage = ({ data }) => {
        let [message, ...overloads] = encoder.decode<any[]>(data)
        shouldMute = true
        next(message, ...overloads)
      }
      return close
    },
  }
}
