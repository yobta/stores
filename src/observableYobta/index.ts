import { isFunction } from '../_internal/isFunction/index.js'

// #region Types
export interface VoidFunction {
  (): void
}
export interface Observer<S> {
  (state: S, ...args: any[]): void
}

export interface ObservableStore<S> {
  last: StateGetter<S>
  next: StateSetter<S>
  observe(observer: Observer<S>): VoidFunction
}

export type ObservableEvent<S> = S | ((last: S) => S)

export interface StateGetter<S> {
  (): S
}
export interface StateSetter<S> {
  (action: ObservableEvent<S>, ...args: any[]): void
}

type EventType = 'START' | 'STOP' | 'NEXT'

export interface StoreEvent<S> {
  initialState: S
  last: StateGetter<S>
  next: StateSetter<S>
  type: EventType
}
export interface StoreListener<S> {
  (event: StoreEvent<S>): void
}

interface ObservableFactory {
  <S>(initialState: S, ...listeners: StoreListener<S>[]): ObservableStore<S>
}
// #endregion

export const observableYobta: ObservableFactory = <S>(
  initialState: S,
  ...listeners: StoreListener<S>[]
) => {
  let observers: Observer<any>[] = []
  let state = initialState

  let last: StateGetter<S> = () => state
  let next = (action: any, ...args: any[]): void => {
    state = isFunction(action)
      ? // @ts-ignore
        action(state)
      : action
    observers.forEach(observe => {
      observe(state, ...args)
    })
    emit('NEXT')
  }

  let emit = (type: EventType): void => {
    listeners.forEach(send => {
      send({ initialState, type, last, next })
    })
  }

  return {
    last,
    next,
    observe: observer => {
      observers.push(observer)
      if (observers.length === 1) {
        emit('START')
      }
      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (observers.length === 0) {
          emit('STOP')
        }
      }
    },
  }
}
