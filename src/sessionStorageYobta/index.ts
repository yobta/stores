import { encoderYobta } from '../encoderYobta/index.js'
import { BackEndFactory } from '../_internal/BackEndYobta/index.js'

export const sessionStorageYobta: BackEndFactory = ({
  channel,
  encoder = encoderYobta,
}) => {
  return {
    initial(state) {
      let item = sessionStorage.getItem(channel)
      return item === null ? state : encoder.decode(item)
    },
    next(message) {
      let encodedMessage = encoder.encode(message)
      sessionStorage.setItem(channel, encodedMessage)
    },
    observe: () => () => {},
  }
}
