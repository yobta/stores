import { YobtaStoreObserver } from '../../stores/storeYobta/index.js'

interface YobtaGemCutterFactory {
  <State extends any, Overloads extends any[] = any[]>(): {
    next(state: State, ...overloads: Overloads): void
    observe(
      observer: YobtaStoreObserver<State, Overloads>,
      ...callbacks: VoidFunction[]
    ): VoidFunction
    size: number
  }
}

type YobtaStackItem<State, Overloads extends any[]> = [
  YobtaStoreObserver<State, Overloads>,
  VoidFunction[],
]

export const gemCutterYobta: YobtaGemCutterFactory = <
  State extends any,
  Overloads extends any[] = any[],
>() => {
  let heap = new Set<YobtaStackItem<State, Overloads>>()
  return {
    get size() {
      return heap.size
    },
    next(state: State, ...overloads: Overloads) {
      let observers = new Set<YobtaStoreObserver<State, Overloads>>()
      let callbacks = new Set<VoidFunction>()
      heap.forEach(([observer, callbackArray]) => {
        observers.add(observer)
        callbackArray.forEach(callback => {
          callbacks.add(callback)
        })
      })
      observers.forEach(observer => {
        observer(state, ...overloads)
      })
      callbacks.forEach(callback => {
        callback()
      })
    },
    observe(
      observer: YobtaStoreObserver<State, Overloads>,
      ...callbacks: VoidFunction[]
    ) {
      let item: YobtaStackItem<State, Overloads> = [observer, callbacks]
      heap.add(item)
      return (): void => {
        heap.delete(item)
      }
    },
  }
}
