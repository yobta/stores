import { encoderYobta } from '../encoderYobta/index.js'
import { BackEndFactory } from '../_internal/BackEndYobta/index.js'

export const broadcastChannelYobta: BackEndFactory = ({
  channel,
  encoder = encoderYobta,
}) => {
  let bc: BroadcastChannel | null = null

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
    initial: state => state,
    next(message) {
      let shouldClose = !bc
      let encodedMessage = encoder.encode(message)
      open().postMessage(encodedMessage)
      if (shouldClose) {
        close()
      }
    },
    observe(next) {
      open().onmessage = ({ data }) => {
        let message = encoder.decode(data)
        next(message)
      }
      return close
    },
  }
}
