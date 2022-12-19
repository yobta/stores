export type YobtaObservable<Item> = {
  next(item: Item, ...overloads: any[]): void
  observe(observer: YobtaObserver<Item>): VoidFunction
}

export type YobtaObserver<Item> = (item: Item, ...overloads: any[]) => void

interface YobtaObservableFactory {
  <Item>(): YobtaObservable<Item>
}

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
  }
}
