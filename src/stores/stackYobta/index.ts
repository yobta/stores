import { YobtaObserver } from '../../util/observableYobta/index.js'
import { YobtaPubsubSubscriber } from '../../util/pubSubYobta/index.js'
import { storeYobta, YobtaStorePlugin } from '../storeYobta/index.js'

export type YobtaStackStore<Item, Overloads extends any[] = any[]> = {
  add(member: Item, ...overloads: any[]): boolean
  last(): Item
  observe(observer: YobtaObserver<ReadonlySet<Item>, Overloads>): VoidFunction
  onReady(
    handler: YobtaPubsubSubscriber<ReadonlySet<Item>, never>,
  ): VoidFunction
  onIdle(handler: YobtaPubsubSubscriber<ReadonlySet<Item>, never>): VoidFunction
  remove(member: Item, ...overloads: any[]): boolean
  size(): number
}

interface YobtaStackStoreFactory {
  <Item, Overloads extends any[] = any[]>(
    initialState: Set<Item> | Item[],
    ...plugins: YobtaStorePlugin<ReadonlySet<Item>, Overloads>[]
  ): YobtaStackStore<Item, Overloads>
}

/**
 * Creates an observable stack store.
 * @example
 * const store = stackYobta([])
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/stackYobta/index.md}
 */
export const stackYobta: YobtaStackStoreFactory = <
  Item,
  Overloads extends any[],
>(
  initialState?: Set<Item> | Item[],
  ...plugins: YobtaStorePlugin<ReadonlySet<Item>, Overloads>[]
) => {
  let { last, observe, next, onReady, onIdle } = storeYobta<
    ReadonlySet<Item>,
    Overloads
  >(new Set(initialState), ...plugins)
  return {
    add(item: Item, ...overloads: Overloads) {
      let state = last()
      if (!state.has(item)) {
        let nextState = new Set([item, ...state])
        next(nextState, ...overloads)
        return true
      }
      return false
    },
    last() {
      let [first] = last()
      return first
    },
    observe,
    onReady,
    onIdle,
    remove(item: Item, ...overloads: Overloads) {
      let state = new Set(last())
      let result = state.delete(item)
      if (result) next(state, ...overloads)
      return result
    },
    size: () => last().size,
  }
}
