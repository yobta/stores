import { useSyncExternalStore } from 'react'

import { YobtaReadable } from '../../../index.js'

export interface YobtaReactStoreHook {
  <State = any, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
    options?: YobtaReactStoreHookOptions<State>,
  ): State
}

export type YobtaReactStoreHookOptions<State> = {
  getServerSnapshot?: () => State
}

/**
 * A react hook for @yobta/stores
 * @example
 * const state = useStore(myStore)
 * @documentation {@link https://github.com/yobta/stores/blob/master/src/adapters/react/index.md}.
 */
export const useYobta: YobtaReactStoreHook = (
  { last, observe },
  { getServerSnapshot } = {},
) => useSyncExternalStore(observe, last, getServerSnapshot)
