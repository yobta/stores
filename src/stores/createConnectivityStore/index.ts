import { lazyPlugin } from '../../plugins/lazyPlugin/index.js'
import { readableYobta, YobtaReadable } from '../../util/readableYobta/index.js'
import { createStore, YOBTA_IDLE, YOBTA_READY } from '../createStore/index.js'

interface YobtaOnlineStoreFactory {
  (): YobtaReadable<boolean | null, never>
}
export type YobtaOnlineStore = ReturnType<YobtaOnlineStoreFactory>

export const createConnectivityStore: YobtaOnlineStoreFactory = () => {
  let store = createStore(null, lazyPlugin, ({ addMiddleware, next }) => {
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
