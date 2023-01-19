import { lazyPluginYobta } from '../../plugins/lazyPluginYobta/index.js'
import { readableYobta, YobtaReadable } from '../../util/readableYobta/index.js'
import { storeYobta, YOBTA_IDLE, YOBTA_READY } from '../storeYobta/index.js'

interface YobtaOnlineStoreFactory {
  (): YobtaReadable<boolean | null, never>
}
export type YobtaOnlineStore = ReturnType<YobtaOnlineStoreFactory>

export const onlineYobta: YobtaOnlineStoreFactory = () => {
  let store = storeYobta(null, lazyPluginYobta, ({ addMiddleware, next }) => {
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
  })
  return readableYobta(store)
}
