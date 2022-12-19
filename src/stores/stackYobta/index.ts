import { Store, storeYobta } from '../storeYobta/index.js'

interface StackFactory {
  <Item>(initialState?: Set<Item> | Item[]): Omit<
    Store<Set<Item>>,
    'last' | 'next'
  > & {
    add(member: Item): void
    last(): Item
    next(state: Set<Item>): void
    remove(member: Item): boolean
    size(): number
  }
}

export const stackYobta: StackFactory = <Item>(
  initialState?: Set<Item> | Item[],
) => {
  let store = storeYobta<Set<Item>>(new Set([...(initialState || [])]))
  return {
    ...store,
    add(member: Item) {
      store.next(new Set([member, ...store.last()]))
    },
    remove(member: Item) {
      let last = store.last()
      let result = last.delete(member)
      store.next(last)
      return result
    },
    last() {
      let [first] = store.last()
      return first
    },
    size: () => store.last().size,
  }
}
