import { isFunction } from '../util/isFunction/index.js'

// #region Types
export interface VoidFunction {
  (): void
}
export interface Observer<S> {
  (state: S, ...args: any[]): void
}

export const YOBTA_INIT = 'init'
export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'

export type StoreEvent =
  | typeof YOBTA_INIT
  | typeof YOBTA_READY
  | typeof YOBTA_IDLE
  | typeof YOBTA_NEXT

export type StoreMiddleware<State> = (...args: any[]) => State

export type StorePlugin<State> = (props: {
  addMiddleware(type: StoreEvent, middleware: StoreMiddleware<State>): void
  initialState: State
  next: StateSetter<State>
}) => void

export type StateGetter<State> = () => State
export type StateSetter<State> = (
  action: State | ((last: State) => State),
  ...overloads: any[]
) => void
export type StoreAction<State> = Parameters<StateSetter<State>>[0]

interface ObservableFactory {
  <State>(initialState: State, ...plugins: StorePlugin<State>[]): {
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
  ...plugins: StorePlugin<State>[]
) => {
  let middlewares: Record<StoreEvent, StoreMiddleware<State>[]> = {
    init: [],
    ready: [],
    idle: [],
    next: [],
  }
  let addMiddleware = (
    type: StoreEvent,
    middleware: StoreMiddleware<State>,
  ): void => {
    middlewares[type].push(middleware)
  }
  let observers: Observer<any>[] = []
  let state: State

  let next: StateSetter<State> = (action: any, ...overloads): void => {
    state = transition(
      YOBTA_NEXT,
      isFunction(action) ? action(state) : action,
      ...overloads,
    )
    observers.forEach(observe => {
      observe(state, ...overloads)
    })
  }

  plugins.forEach(plugin => {
    plugin({ addMiddleware, initialState, next })
  })

  let transition = (
    type: StoreEvent,
    nextState: any,
    ...overloads: any[]
  ): State => {
    let eventMiddlewares = middlewares[type]

    let result: State = eventMiddlewares.reduce(
      (acc, middleware) => middleware(acc, ...overloads),
      nextState,
    )

    return result
  }

  state = transition(YOBTA_INIT, initialState)

  let last: StateGetter<State> = () => state

  return {
    last,
    next,
    observe: observer => {
      if (observers.length === 0) {
        state = transition(YOBTA_READY, state)
      }

      observers.push(observer)

      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (observers.length === 0) {
          state = transition(YOBTA_IDLE, state)
        }
      }
    },
  }
}
