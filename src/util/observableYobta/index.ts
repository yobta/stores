export type YobtaObservable<Item, Overloads extends any[]> = {
  next(item: Item, ...overloads: Overloads): void
  observe(observer: YobtaObserver<Item, Overloads>): VoidFunction
  size: number
}

export type YobtaObserver<Item, Overloads extends any[]> = (
  item: Item,
  ...overloads: Overloads
) => void

interface YobtaObservableFactory {
  <Item extends any, Overloads extends any[] = any[]>(): YobtaObservable<
    Item,
    Overloads
  >
}

/**
 * Creates an observable object.
 *
 * @example
 * const observable = observableYobta()
 * const unsubscribe = observable.observe(console.log)
 * observable.next('value')
 * unsubscribe()
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/observableYobta/index.md}
 */
export const observableYobta: YobtaObservableFactory = () => {
  let observers = new Set<YobtaObserver<any, any>>()
  return {
    next(item, ...overloads) {
      observers.forEach(observer => {
        observer(item, ...overloads)
      })
    },
    observe(observer) {
      observers.add(observer)
      return () => observers.delete(observer)
    },
    get size() {
      return observers.size
    },
  }
}
