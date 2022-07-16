import { isFunction } from '../_internal/isFunction/index.js'

// #region Types
export interface VoidFunction {
  (): void
}
export interface Observer<S> {
  (state: S, ...args: any[]): void
}

// NOTE:
// https://github.com/microsoft/TypeScript/issues/32164#issuecomment-1146737709
export interface StorePlugin<State> {
  (
    event: {
      initialState: State
      last(): State
      next(action: State | ((last: State) => State), ...overloads: any[]): void
      type: 'START' | 'STOP' | 'NEXT'
    },
    ...overloads: any[]
  ): void
}

export type StoreEvent<State> = Parameters<StorePlugin<State>>[0]

export type StateGetter<State> = StoreEvent<State>['last']
export type StateSetter<State> = StoreEvent<State>['next']
export type StoreEventType = StoreEvent<unknown>['type']
export type StoreAction<State> = Parameters<StateSetter<State>>[0]

interface ObservableFactory {
  <State>(initialState: State, ...listeners: StorePlugin<State>[]): {
    last: StateGetter<State>
    next: StateSetter<State>
    observe(observer: Observer<State>): VoidFunction
  }
}

export interface ObservableStore<State> {
  last: StateGetter<State>
  next: StateSetter<State>
  observe(observer: Observer<State>): VoidFunction
}
// #endregion

export const observableYobta: ObservableFactory = <State>(
  initialState: State,
  ...listeners: StorePlugin<State>[]
) => {
  let observers: Observer<any>[] = []
  let state = initialState

  let last: StateGetter<State> = () => state
  let next: StateSetter<State> = (action: any, ...overloads): void => {
    state = isFunction(action) ? action(state) : action
    observers.forEach(observe => {
      observe(state, ...overloads)
    })
    emit('NEXT')
  }

  let emit = (type: StoreEventType): void => {
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
