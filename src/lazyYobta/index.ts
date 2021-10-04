import { ObservableStore, singletonYobta, Terminator } from '..'
import { getInitialState } from '../_internal/getInitialState'

interface LazyFactory {
  <S>(mount: () => S, unmount?: Terminator): ObservableStore<S>
  <S>(initialState: S, terminate?: never): ObservableStore<S>
}

let idle: any

export const lazyYobta: LazyFactory = (mount, unmount) => {
  let store = singletonYobta(idle)
  return {
    ...store,
    last() {
      return store.size() ? store.last() : getInitialState(mount)
    },
    observe(observer) {
      if (!store.size()) {
        let next = getInitialState(mount)
        store.next(() => next)
      }
      let unobserve = store.observe(observer)
      return () => {
        unobserve()
        store.next(() => idle)
        if (unmount && !store.size()) unmount()
      }
    },
  }
}
