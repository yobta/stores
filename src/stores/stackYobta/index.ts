import { YobtaObserver } from '../../util/observableYobta/index.js'
import {
  storeYobta,
  YobtaStoreEvent,
  YobtaStorePlugin,
} from '../storeYobta/index.js'

interface YobtaStackFactory {
  <Item, Overloads extends any[] = any[]>(
    initialState: Set<Item> | Item[],
    ...plugins: YobtaStorePlugin<ReadonlySet<Item>, Overloads>[]
  ): {
    add(member: Item, ...overloads: any[]): boolean
    last(): Item
    observe(observer: YobtaObserver<ReadonlySet<Item>, Overloads>): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: ReadonlySet<Item>) => void,
    ): VoidFunction
    remove(member: Item, ...overloads: any[]): boolean
    size(): number
  }
}

export const stackYobta: YobtaStackFactory = <Item, Overloads extends any[]>(
  initialState?: Set<Item> | Item[],
  ...plugins: YobtaStorePlugin<ReadonlySet<Item>, Overloads>[]
) => {
  let { last, observe, next, on } = storeYobta<ReadonlySet<Item>, Overloads>(
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
