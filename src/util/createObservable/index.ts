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
    ...callbacks: YobtaObserver<Item, Overloads>[]
  ): VoidFunction
  size: number
}

export type YobtaObserver<
  Item extends any = any,
  Overloads extends any[] = any[],
> = (item: Item, ...overloads: Overloads) => void

type YobtaHeapItem<
  Item extends any = any,
  Overloads extends any[] = any[],
> = YobtaObserver<Item, Overloads>[]
// #endregion

/**
 * Creates an observable object.
 *
 * @example
 * const observable = observable()
 * const unsubscribe = observable.observe(console.log)
 * observable.next('value')
 * unsubscribe()
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/observable/index.md}
 */
export const createObservable: YobtaObservableFactory = <
  Item extends any,
  Overloads extends any[] = any[],
>() => {
  let heap = new Set<YobtaHeapItem<Item, Overloads>>()
  return {
    get size() {
      return heap.size
    },
    next(item: Item, ...overloads: Overloads) {
      let sortMap = new Map<YobtaObserver<Item, Overloads>, number>()
      heap.forEach(chunk => {
        chunk.forEach((cb, i) => sortMap.set(cb, i))
      })
      ;[...sortMap.entries()]
        .sort((a, b) => a[1] - b[1])
        .forEach(([cb]) => {
          cb(item, ...overloads)
        })
    },
    observe(...callbacks: YobtaObserver<Item, Overloads>[]) {
      heap.add(callbacks)
      return () => heap.delete(callbacks)
    },
  }
}
