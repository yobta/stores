import { useState, useEffect } from 'react'

export function useStore(store) {
  let [, forceUpdate] = useState({})

  useEffect(() => store.observe(() => forceUpdate({})), [store])

  return store.last()
}
