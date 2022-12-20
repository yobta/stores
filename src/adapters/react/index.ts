import { useState, useEffect } from 'react'

import { YobtaObserver, YobtaStateGetter } from '../../index.js'

interface YobtaAnyStore<State> {
  last: YobtaStateGetter<State>
  observe(observer: YobtaObserver<any>): VoidFunction
}
export interface YobtaReactStoreHook {
  <State>(store: YobtaAnyStore<State>): State
}

/**
A hook for subscribing to changes in a Yobta store in a React component.
@param {YobtaAnyStore<State>} store - The Yobta store to subscribe to.
@returns {State} - The current state of the store.
@template State - The type of state contained in the store.
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
