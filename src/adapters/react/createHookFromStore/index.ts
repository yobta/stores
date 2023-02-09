import { YobtaReadable } from '../../../util/readable/index.js'
import { useStore, YobtaReactStoreHookOptions } from '../useStore/index.js'

interface YobtaHookFactory {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
    options?: YobtaReactStoreHookOptions<State>,
  ): () => State
}

export const createHookFromStore: YobtaHookFactory = (store, options) => () =>
  useStore(store, options)
