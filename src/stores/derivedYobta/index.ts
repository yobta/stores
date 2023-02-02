import { YobtaObserver } from '../../util/observableYobta/index.js'
import { YobtaReadable } from '../../util/readableYobta/index.js'
import { storeYobta, YobtaAnyStore, YobtaState } from '../storeYobta/index.js'

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
 * const store1 = storeYobta(1)
 * const store2 = storeYobta(1)
 * const derived = derivedYobta((state1, state2) => state1 + state2, store1, store2)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/derivedYobta/index.md}
 */
export const derivedYobta: Yobtaderived = (acc, ...stores) => {
  let getState = (): any =>
    acc(...(stores.map(({ last }) => last()) as States<typeof stores>))
  let { last, on, next, observe } = storeYobta<any, never>(getState())
  let debounce = (): void => {}
  let update = (): void => {
    next(getState())
  }
  return {
    last,
    observe(observer: YobtaObserver<any, never>, ...callbacks) {
      let unsubcribe = [
        ...stores.map(store => store.observe(debounce, update, ...callbacks)),
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
