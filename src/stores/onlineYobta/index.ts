import { lazyPluginYobta } from '../../plugins/lazyPluginYobta/index.js'
import { readableYobta, YobtaReadable } from '../../util/readableYobta/index.js'
import { storeYobta, YOBTA_IDLE, YOBTA_READY } from '../storeYobta/index.js'

type State = boolean | null
export type YobtaOnlineStore = YobtaReadable<State>

interface YobtaOnlineStoreFactory {
  (): YobtaOnlineStore
}

export const onlineYobta: YobtaOnlineStoreFactory = () => {
  let store = storeYobta<State>(
    null,
    lazyPluginYobta,
    ({ addMiddleware, next }) => {
      let on: VoidFunction = () => {
        next(true)
      }
      let off: VoidFunction = () => {
        next(false)
      }
      addMiddleware(YOBTA_READY, () => {
        window.addEventListener('online', on)
        window.addEventListener('offline', off)
        return navigator.onLine
      })
      addMiddleware(YOBTA_IDLE, () => {
        window.removeEventListener('online', on)
        window.removeEventListener('offline', off)
        return null
      })
    },
  )
  return readableYobta(store)
}
