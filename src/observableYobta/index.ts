import { isEmptyArray } from '../_internal/isEmptyArray'
import { isFunction } from '../_internal/isFunction'

// #region Types
interface VoidFunction {
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

type Action<S> = S | ((last: S) => S)

interface StateGetter<S> {
  (): S
}
interface StateSetter<S> {
  (action: Action<S>, ...args: any[]): void
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
      if (isEmptyArray(observers)) {
        emit('START')
      }
      observers.push(observer)
      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (isEmptyArray(observers)) {
          emit('STOP')
        }
      }
    },
  }
}
