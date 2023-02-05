import { YobtaReadable } from '../../../util/readableYobta/index.js'
import { useYobta, YobtaReactStoreHookOptions } from '../useYobta/index.js'

interface YobtaHookFactory {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
    options?: YobtaReactStoreHookOptions<State>,
  ): () => State
}

export const hookYobta: YobtaHookFactory = (store, options) => () =>
  useYobta(store, options)
