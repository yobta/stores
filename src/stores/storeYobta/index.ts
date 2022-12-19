// #region Types
export interface VoidFunction {
  (): void
}
export interface Observer<State> {
  (state: State, ...args: any[]): void
}

export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'

export type StoreEvent =
  | typeof YOBTA_READY
  | typeof YOBTA_IDLE
  | typeof YOBTA_NEXT

export type StoreMiddleware<State> = (
  state: State,
  ...overloads: any[]
) => State

export type StorePlugin<State> = (props: {
  addMiddleware(type: StoreEvent, middleware: StoreMiddleware<State>): void
  initialState: State
  next: StateSetter<State>
  last(): State
}) => void

export type StateGetter<State> = () => State
export type StateSetter<State> = (
  action: State | ((last: State) => State),
  ...overloads: any[]
) => void
export type StoreAction<State> = Parameters<StateSetter<State>>[0]

interface StoreFactory {
  <State>(initialState: State, ...plugins: StorePlugin<State>[]): {
    last: StateGetter<State>
    next: StateSetter<State>
    observe(observer: Observer<State>): VoidFunction
  }
}

export interface Store<State> {
  last: StateGetter<State>
  next: StateSetter<State>
  observe(observer: Observer<State>): VoidFunction
}
// #endregion

export const storeYobta: StoreFactory = <State>(
  initialState: State,
  ...plugins: StorePlugin<State>[]
) => {
  let middlewares: Record<StoreEvent, StoreMiddleware<State>[]> = {
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
  let observers = new Set<Observer<any>>()
  let state: State = initialState
  let next: StateSetter<State> = (action: any, ...overloads): void => {
    state = transition(
      YOBTA_NEXT,
      typeof action === 'function' ? action(state) : action,
      ...overloads,
    )
    observers.forEach(observe => {
      observe(state, ...overloads)
    })
  }
  let last: StateGetter<State> = () => state
  plugins.forEach(plugin => {
    plugin({ addMiddleware, initialState, next, last })
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

  return {
    last,
    next,
    observe: observer => {
      if (observers.size === 0) {
        state = transition(YOBTA_READY, state)
      }
      observers.add(observer)
      return () => {
        observers.delete(observer)
        if (observers.size === 0) {
          state = transition(YOBTA_IDLE, state)
        }
      }
    },
  }
}
