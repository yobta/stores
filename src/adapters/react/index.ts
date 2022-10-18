import { useState, useEffect } from 'react'

import { StateGetter, Observer } from '../../index.js'

interface AnyObservable<S> {
  last: StateGetter<S>
  observe(observer: Observer<any>): VoidFunction
}
export interface ReactObservableHook {
  <S>(store: AnyObservable<S>): S
}

export const useObservable: ReactObservableHook = store => {
  let [, forceUpdate] = useState({})

  useEffect(() => {
    forceUpdate({})
    return store.observe(forceUpdate)
  }, [store])

  return store.last()
}
