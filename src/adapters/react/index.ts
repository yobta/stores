import { useState, useEffect } from 'react'

import { ObservableStore } from '../..'

export interface ReactStoreHook {
  <S>(store: ObservableStore<S>): S
}

export const useStore: ReactStoreHook = store => {
  let [, forceUpdate] = useState({})

  useEffect(() => store.observe(forceUpdate), [store])

  return store.last()
}
