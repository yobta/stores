import {
  createStore,
  YobtaStore,
  YobtaStorePlugin,
} from '../createStore/index.js'

export type YobtaStackStore<Item, Overloads extends any[] = any[]> = Omit<
  YobtaStore<Item | undefined, Overloads>,
  'next'
> & {
  push(member: Item, ...overloads: any[]): number
  pop(...overloads: any[]): Item | undefined
  size(): number
}

/**
 * Creates an observable stack store.
 * @example
 * const store = createStackStore([])
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createStackStore/index.md}
 */
export const createStackStore = <Item, Overloads extends any[]>(
  initialState: Item[] = [],
  ...plugins: YobtaStorePlugin<Item | undefined, Overloads>[]
): YobtaStackStore<Item | undefined, Overloads> => {
  let stack = [...initialState]

  let value = (): Item | undefined => stack[stack.length - 1]

  let { next, ...store } = createStore(value(), ...plugins)

  return {
    ...store,
    push(item: Item, ...overloads: Overloads) {
      let size = stack.push(item)
      next(value(), ...overloads)
      return size
    },
    pop(...overloads: Overloads) {
      let lastLength = stack.length
      let last = stack.pop()
      if (lastLength !== stack.length) {
        next(value(), ...overloads)
      }
      return last
    },
    size: () => stack.length,
  }
}
