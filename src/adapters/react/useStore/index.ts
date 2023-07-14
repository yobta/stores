import { useEffect, useMemo, useSyncExternalStore } from 'react'

import { YobtaReadable, YobtaStore } from '../../../index.js'

export interface YobtaReactStoreHook {
  <State = any, Overloads extends any[] = any[]>(
    store: YobtaStore<State, Overloads> | YobtaReadable<State, Overloads>,
    options?: YobtaReactStoreHookOptions<State>,
    ...overloads: Overloads
  ): State
}

export type YobtaReactStoreHookOptions<State> = {
  serverState?: State
}

/**
 * A react hook for @yobta/stores
 * @example
 * const state = useStore(myStore)
 * @documentation {@link https://github.com/yobta/stores/blob/master/src/adapters/react/index.md}.
 */
export const useStore: YobtaReactStoreHook = (
  store,
  { serverState } = {},
  ...overloads
) => {
  let getServerState = useMemo(
    () => () => serverState === undefined ? store.last() : serverState,
    [serverState],
  )
  useEffect(() => {
    if (serverState !== undefined && 'next' in store) {
      store.next(serverState, ...overloads)
    }
  }, [serverState])
  return useSyncExternalStore(store.observe, store.last, getServerState)
}
