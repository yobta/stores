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
  <Item, Overloads extends any[] = any[]>(): YobtaObservable<Item, Overloads>
}

/**
 * Creates a new YobtaObservable instance.
 * @returns {{
 *   next: (item: Item, ...overloads: any[]) => void,
 *   observe: (observer: YobtaObserver<Item>) => VoidFunction,
 *   size: number
 * }} A new YobtaObservable instance.
 * @template Item
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
