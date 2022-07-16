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
      type: 'INIT' | 'READY' | 'IDLE' | 'NEXT'
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

  let shouldEmitNext: boolean = true

  let last: StateGetter<State> = () => state
  let next: StateSetter<State> = (action: any, ...overloads): void => {
    state = isFunction(action) ? action(state) : action
    observers.forEach(observe => {
      observe(state, ...overloads)
    })
    if (shouldEmitNext) {
      emit('NEXT', ...overloads)
    }
  }

  let emit = (type: StoreEventType, ...overloads: any[]): void => {
    shouldEmitNext = false
    listeners.forEach(send => {
      send({ initialState, type, last, next }, ...overloads)
    })
    shouldEmitNext = true
  }

  return {
    last,
    next,
    observe: observer => {
      if (observers.length === 0) {
        emit('INIT')
      }

      observers.push(observer)

      if (observers.length === 1) {
        emit('READY')
      }

      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (observers.length === 0) {
          emit('IDLE')
        }
      }
    },
  }
}
