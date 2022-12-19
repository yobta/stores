import { Store, storeYobta } from '../storeYobta/index.js'

interface StackFactory {
  <Item>(initialState?: Set<Item> | Item[]): Omit<
    Store<Set<Item>>,
    'last' | 'next'
  > & {
    add(member: Item): void
    last(): Item
    remove(member: Item): boolean
    size(): number
  }
}

export const stackYobta: StackFactory = <Item>(
  initialState?: Set<Item> | Item[],
) => {
  let { last, next, observe } = storeYobta<Set<Item>>(
    new Set(initialState || []),
  )
  return {
    add(member: Item) {
      next(new Set([member, ...last()]))
    },
    observe,
    remove(member: Item) {
      let nextState = new Set(last())
      let result = nextState.delete(member)
      next(nextState)
      return result
    },
    last() {
      let [first] = last()
      return first
    },
    size: () => last().size,
  }
}
