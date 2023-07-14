import { YobtaReadable } from '../../../util/readable/index.js'
import { useStore, YobtaReactStoreHookOptions } from '../useStore/index.js'

interface YobtaHookFactory {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
  ): (
    options?: YobtaReactStoreHookOptions<State>,
    ...overloads: Overloads
  ) => State
}

export const createHookFromStore: YobtaHookFactory =
  store =>
  (options, ...overloads) =>
    useStore(store, options, ...overloads)
