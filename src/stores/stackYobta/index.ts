import { ObservableStore, observableYobta } from '../observableYobta/index.js'

interface StackFactory {
  <Item>(initialState?: Set<Item> | Item[]): Omit<
    ObservableStore<Set<Item>>,
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
  let store = observableYobta<Set<Item>>(new Set([...(initialState || [])]))
  return {
    ...store,
    add(member: Item) {
      store.next(last => new Set([member, ...last]))
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
