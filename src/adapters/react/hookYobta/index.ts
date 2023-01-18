import { YobtaReadable } from '../../../util/readableYobta/index.js'
import { useYobta } from '../useYobta/index.js'

interface YobtaHookFactory {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
  ): () => State
}

export const hookYobta: YobtaHookFactory = store => () => useYobta(store)
