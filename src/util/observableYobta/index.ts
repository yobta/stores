export type YobtaObservable<Item> = {
  next(item: Item, ...overloads: any[]): void
  observe(observer: YobtaObserver<Item>): VoidFunction
  size: number
}

export type YobtaObserver<Item> = (item: Item, ...overloads: any[]) => void

interface YobtaObservableFactory {
  <Item>(): YobtaObservable<Item>
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
  let observers = new Set<YobtaObserver<any>>()
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
