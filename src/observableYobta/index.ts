import { isEmptyArray } from '../_internal/isEmptyArray'
import { isFunction } from '../_internal/isFunction'

export interface Terminator {
  (): void
}

export interface Observer<S> {
  (state: S, ...args: any[]): void
}

export type Action<S> = S | ((last: S) => S)

export interface ObservableStore<S> {
  last(): Readonly<S>
  next(action: Action<S>, ...args: any[]): void
  observe(observer: Observer<S>): Terminator
}

interface StoreFactory {
  <S>(start: () => S, stop?: Terminator): ObservableStore<S>
  <S>(initialState: S, stop?: never): ObservableStore<S>
}

export const observableYobta: StoreFactory = (start, stop) => {
  let observers: Observer<any>[] = []
  let state = start

  return {
    last: () => {
      // @ts-ignore
      return isFunction(start) && isEmptyArray(observers) ? start() : state
    },
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
      if (isFunction(start) && isEmptyArray(observers)) {
        // @ts-ignore
        state = start()
      }
      observers.push(observer)
      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (isFunction(stop) && isEmptyArray(observers)) {
          // @ts-ignore
          stop()
          // @ts-ignore
          state = undefined
        }
      }
    },
  }
}
