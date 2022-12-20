import { YobtaObserver } from '../../util/observableYobta/index.js'
import { storeYobta, YobtaStorePlugin } from '../storeYobta/index.js'

interface YobtaStackFactory {
  <Item>(
    initialState?: Set<Item> | Item[],
    ...plugins: YobtaStorePlugin<Set<Item>>[]
  ): {
    add(member: Item): void
    last(): Item
    observe(observer: YobtaObserver<Set<Item>>): VoidFunction
    remove(member: Item): boolean
    size(): number
  }
}

export const stackYobta: YobtaStackFactory = <Item>(
  initialState?: Set<Item> | Item[],
  ...plugins: YobtaStorePlugin<Set<Item>>[]
) => {
  let { last, observe, next } = storeYobta(new Set(initialState), ...plugins)
  return {
    add(item: Item) {
      let state = last()
      let nextState = new Set([item, ...state])
      next(nextState)
    },
    last() {
      let [first] = last()
      return first
    },
    observe,
    remove(item: Item) {
      let state = last()
      let result = state.delete(item)
      if (result) next(new Set(state))
      return result
    },
    size: () => last().size,
  }
}
