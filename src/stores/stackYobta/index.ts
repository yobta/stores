import { YobtaObserver } from '../../util/observableYobta/index.js'
import {
  storeYobta,
  YobtaStoreEvent,
  YobtaStorePlugin,
} from '../storeYobta/index.js'

interface YobtaStackFactory {
  <Item, Overloads extends any[] = any[]>(
    initialState: Set<Item> | Item[],
    ...plugins: YobtaStorePlugin<Set<Item>, Overloads>[]
  ): {
    add(member: Item, ...overloads: any[]): boolean
    last(): Item
    observe(observer: YobtaObserver<Set<Item>, Overloads>): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: Set<Item>) => void,
    ): VoidFunction
    remove(member: Item, ...overloads: any[]): boolean
    size(): number
  }
}

/**
 * Creates a new observable stack store.
 *
 * @template Item
 * @param {Set<Item> | Item[]} [initialState] - The initial state of the stack.
 * @param {YobtaStorePlugin<Set<Item>>[]} [plugins] - The plugins to use with the store.
 * @returns {{
 *   add: (member: Item, ...overloads: any[]) => boolean,
 *   last: () => Item,
 *   observe: (observer: YobtaObserver<Set<Item>>) => VoidFunction,
 *   remove: (member: Item, ...overloads: any[]) => boolean,
 *   size: () => number
 * }} An object with methods for interacting with the stack.
 *
 * The `add` method adds a new item to the stack, and returns `true` if the item was successfully added. If the item already exists in the stack, the method returns `false` and does not add the item.
 *
 * The `last` method returns the last item added to the stack.
 *
 * The `observe` method allows an observer function to be registered with the stack. This observer function will be called whenever the stack is updated, with the updated stack set as the first argument and any additional overloads passed as additional arguments.
 *
 * The `remove` method removes an item from the stack, and returns `true` if the item was successfully removed. If the item does not exist in the stack, the method returns `false` and does not remove the item.
 *
 * The `size` method returns the number of items in the stack.
 */
export const stackYobta: YobtaStackFactory = <Item, Overloads extends any[]>(
  initialState?: Set<Item> | Item[],
  ...plugins: YobtaStorePlugin<Set<Item>, Overloads>[]
) => {
  let { last, observe, next, on } = storeYobta<Set<Item>, Overloads>(
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
      let state = last()
      let result = state.delete(item)
      if (result) next(new Set(state), ...overloads)
      return result
    },
    size: () => last().size,
  }
}
