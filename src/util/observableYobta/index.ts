// #region typings
interface YobtaObservableFactory {
  <Item extends any = any, Overloads extends any[] = any[]>(): YobtaObservable<
    Item,
    Overloads
  >
}

export type YobtaObservable<
  Item extends any = any,
  Overloads extends any[] = any[],
> = {
  next(item: Item, ...overloads: Overloads): void
  observe(
    observer: YobtaObserver<Item, Overloads>,
    ...callbacks: VoidFunction[]
  ): VoidFunction
  size: number
}

export type YobtaObserver<
  Item extends any = any,
  Overloads extends any[] = any[],
> = (item: Item, ...overloads: Overloads) => void

type YobtaStackItem<Item extends any = any, Overloads extends any[] = any[]> = [
  YobtaObserver<Item, Overloads>,
  VoidFunction[],
]
// #endregion

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
export const observableYobta: YobtaObservableFactory = <
  Item extends any,
  Overloads extends any[] = any[],
>() => {
  let heap = new Set<YobtaStackItem<Item, Overloads>>()
  return {
    get size() {
      return heap.size
    },
    next(item: Item, ...overloads: Overloads) {
      let observers = new Set<YobtaObserver<Item, Overloads>>()
      let callbacks = new Set<VoidFunction>()
      heap.forEach(([observer, callbackArray]) => {
        observers.add(observer)
        callbackArray.forEach(callback => {
          callbacks.add(callback)
        })
      })
      observers.forEach(observer => {
        observer(item, ...overloads)
      })
      callbacks.forEach(callback => {
        callback()
      })
    },
    observe(
      observer: YobtaObserver<Item, Overloads>,
      ...callbacks: VoidFunction[]
    ) {
      let item: YobtaStackItem<Item, Overloads> = [observer, callbacks]
      heap.add(item)
      return () => {
        heap.delete(item)
      }
    },
  }
}
