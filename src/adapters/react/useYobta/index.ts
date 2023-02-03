import { useMemo, useSyncExternalStore } from 'react'

import { YobtaReadable } from '../../../index.js'

export interface YobtaReactStoreHook {
  <State = any, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
    options?: {
      serverState?: State
      getServerState?: () => State
    },
  ): State
}

/**
 * A react hook for @yobta/stores
 * @example
 * const state = useYobta(myStore)
 * @documentation {@link https://github.com/yobta/stores/blob/master/src/adapters/react/index.md}.
 */
export const useYobta: YobtaReactStoreHook = (
  { last, observe },
  { serverState, getServerState } = {},
) => {
  let getServerSnapshot = useMemo(() => {
    if (getServerState) return getServerState
    return serverState === undefined ? undefined : () => serverState
  }, [serverState, getServerState])
  let state = useSyncExternalStore(observe, last, getServerSnapshot)
  return state
}
