import { YobtaObserver } from '../../util/createObservable/index.js'
import { YobtaReadable } from '../../util/readable/index.js'
import {
  createStore,
  YobtaAnyStore,
  YobtaState,
  YOBTA_READY,
} from '../createStore/index.js'

// #region Types

type States<Stores extends YobtaAnyStore[]> = {
  [Key in keyof Stores]: Stores[Key] extends YobtaReadable<infer State>
    ? State
    : YobtaState<Stores[Key]>
}
interface Yobtaderived {
  <
    derivedState extends any = any,
    Stores extends YobtaAnyStore[] = YobtaAnyStore[],
  >(
    callback: (...states: States<Stores>) => derivedState,
    ...stores: Stores
  ): YobtaReadable<derivedState, never>
}
// #endregion

/**
 * Aggregates data from one or multiple stores into a single, read-only store.
 *
 * @example
 * const store1 = createStore(1)
 * const store2 = createStore(1)
 * const derived = createDerivedStore((state1, state2) => state1 + state2, store1, store2)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createDerivedStore/index.md}
 */
export const createDerivedStore: Yobtaderived = (acc, ...stores) => {
  let getState = (): any =>
    acc(...(stores.map(({ last }) => last()) as States<typeof stores>))
  let { last, on, next, observe } = createStore<any, never>(
    getState(),
    ({ addMiddleware }) => {
      addMiddleware(YOBTA_READY, getState)
    },
  )
  let update = (): void => {
    next(getState())
  }
  return {
    last,
    observe(observer: YobtaObserver<any, never>, ...callbacks) {
      let unsubcribe = [
        ...stores.map(store => store.observe(() => {}, update, ...callbacks)),
        observe(observer),
      ]
      return () => {
        unsubcribe.forEach(u => {
          u()
        })
      }
    },
    on,
  }
}
