import { lazyPlugin } from '../../plugins/lazyPlugin/index.js'
import { readable, YobtaReadable } from '../../util/readable/index.js'
import { createStore, YOBTA_IDLE, YOBTA_READY } from '../createStore/index.js'

interface YobtaOnlineStoreFactory {
  (): YobtaReadable<boolean | null, any>
}
export type YobtaOnlineStore = ReturnType<YobtaOnlineStoreFactory>

export const createConnectivityStore: YobtaOnlineStoreFactory = () => {
  const store = createStore(null, lazyPlugin, ({ addMiddleware, next }) => {
    const on: VoidFunction = () => {
      next(true)
    }
    const off: VoidFunction = () => {
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
  return readable(store)
}
