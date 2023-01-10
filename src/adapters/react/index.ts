import { useState, useEffect } from 'react'

import { YobtaObserver, YobtaStateGetter } from '../../index.js'

interface YobtaAnyStore<State, Overloads extends any[]> {
  last: YobtaStateGetter<State>
  observe(observer: YobtaObserver<State, Overloads>): VoidFunction
}
export interface YobtaReactStoreHook {
  <State, Overloads extends any[] = any[]>(
    store: YobtaAnyStore<State, Overloads>,
  ): State
}

/**
 * A react hook for @yobta/stores
 * @example
 * const state = useYobta(myStore)
 * @see {@link https://github.com/yobta/stores/blob/master/src/adapters/react/index.md} component docs.
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
