import { useState, useEffect } from 'react'

import { YobtaReadable } from '../../../index.js'

export interface YobtaReactStoreHook {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
  ): State
}

/**
 * A react hook for @yobta/stores
 * @example
 * const state = useYobta(myStore)
 * @documentation {@link https://github.com/yobta/stores/blob/master/src/adapters/react/index.md}.
 */
export const useYobta: YobtaReactStoreHook = store => {
  let [, forceUpdate] = useState({})
  useEffect(() => {
    forceUpdate({})
    return store.observe(() => {
      forceUpdate({})
    })
  }, [store])
  return store.last()
}
