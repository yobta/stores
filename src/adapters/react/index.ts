import { useState, useEffect } from 'react'

import { YobtaObserver, YobtaStateGetter } from '../../index.js'

interface AnyObservable<S> {
  last: YobtaStateGetter<S>
  observe(observer: YobtaObserver<any>): VoidFunction
}
export interface ReactObservableHook {
  <S>(store: AnyObservable<S>): S
}

export const useObservable: ReactObservableHook = store => {
  let [, forceUpdate] = useState({})

  useEffect(() => {
    forceUpdate({})
    return store.observe(() => {
      forceUpdate({})
    })
  }, [store])

  return store.last()
}
