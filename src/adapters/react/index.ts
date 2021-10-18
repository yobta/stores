import { useState, useEffect } from 'react'

import { ObservableStore } from '../..'

export interface ReactObservableHook {
  <S>(store: ObservableStore<S>): S
}

export const useObservable: ReactObservableHook = store => {
  let [, forceUpdate] = useState({})

  useEffect(() => store.observe(forceUpdate), [store])

  return store.last()
}
