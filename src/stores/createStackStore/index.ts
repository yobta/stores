import {
  createStore,
  YobtaIdleEvent,
  YobtaReadyEvent,
  YobtaStorePlugin,
  YobtaTransitionEvent,
} from '../createStore/index.js'

export type YobtaStackStore<Item, Overloads extends any[] = any[]> = {
  add(member: Item, ...overloads: any[]): boolean
  last(): Item
  observe(
    observer: (state: ReadonlySet<Item>, ...overloads: Overloads) => void,
  ): VoidFunction
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: ReadonlySet<Item>) => void,
  ): VoidFunction
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
 * const store = createStackStore([])
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createStackStore/index.md}
 */
export const createStackStore: YobtaStackStoreFactory = <
  Item,
  Overloads extends any[],
>(
  initialState?: Set<Item> | Item[],
  ...plugins: YobtaStorePlugin<ReadonlySet<Item>, Overloads>[]
) => {
  let { last, observe, next, on } = createStore<ReadonlySet<Item>, Overloads>(
    new Set(initialState),
    ...plugins,
  )
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
    on,
    remove(item: Item, ...overloads: Overloads) {
      let state = new Set(last())
      let result = state.delete(item)
      if (result) next(state, ...overloads)
      return result
    },
    size: () => last().size,
  }
}
