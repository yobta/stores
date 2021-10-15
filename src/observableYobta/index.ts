import { isEmptyArray } from '../_internal/isEmptyArray'
import { isFunction } from '../_internal/isFunction'

interface VoidFunction {
  (): void
}

export interface Observer<S> {
  (state: S, ...args: any[]): void
}

export type Action<S> = S | ((last: S) => S)

export interface ObservableStore<S> {
  last(): Readonly<S>
  next(action: Action<S>, ...args: any[]): void
  observe(observer: Observer<S>): VoidFunction
}

interface StoreFactoryOptions {
  onStart?: VoidFunction
  onStop?: VoidFunction
}
interface StoreFactory {
  <S>(initialState: S, options?: StoreFactoryOptions): ObservableStore<S>
}

export const observableYobta: StoreFactory = (initialState, options) => {
  let { onStart, onStop } = options || {}
  let observers: Observer<any>[] = []
  let state = initialState

  return {
    last: () => state,
    next: (action, ...args) => {
      state = isFunction(action)
        ? // @ts-ignore
          action(state)
        : action
      observers.forEach(observe => {
        observe(state, ...args)
      })
    },
    observe: observer => {
      if (onStart && isEmptyArray(observers)) {
        onStart()
      }
      observers.push(observer)
      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (onStop && isEmptyArray(observers)) {
          onStop()
        }
      }
    },
  }
}
