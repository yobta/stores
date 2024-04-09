import {
  createStore,
  YobtaStore,
  YobtaStorePlugin,
} from '../createStore/index.js'

export type YobtaModalStore<Item, Overloads extends any[] = any[]> = Omit<
  YobtaStore<Item | undefined, Overloads>,
  'next'
> & {
  add(member: Item, ...overloads: any[]): void
  remove(member: Item, ...overloads: any[]): boolean
  size(): number
}

/**
 * Unique stack for stacking modal elements.
 * @example
 * const store = createModalStore([])
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createModalStore/index.md}
 */
export const createModalStore = <Item, Overloads extends any[]>(
  initialState: Item[] = [],
  ...plugins: YobtaStorePlugin<Item | undefined, Overloads>[]
): YobtaModalStore<Item | undefined, Overloads> => {
  let stack = new Set(initialState)

  const value = (): Item | undefined => {
    const [item] = stack
    return item
  }

  const { next, ...store } = createStore(value(), ...plugins)

  return {
    ...store,
    add(item: Item, ...overloads: Overloads) {
      stack.delete(item)
      stack = new Set([item, ...stack])
      next(item, ...overloads)
    },
    remove(item: Item, ...overloads: Overloads) {
      const result = stack.delete(item)
      if (result) {
        next(value(), ...overloads)
      }
      return result
    },
    size: () => stack.size,
  }
}
