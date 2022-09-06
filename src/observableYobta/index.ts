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

const INIT = 'init'
const READY = 'ready'
const IDLE = 'idle'
const NEXT = 'next'

type YobtaEvent = typeof INIT | typeof READY | typeof IDLE | typeof NEXT

type MiddleWare<State> = (...args: any[]) => State

export interface StorePlugin<State> {
  (
    addMiddleware: (type: YobtaEvent, middleware: MiddleWare<State>) => void,
  ): void
}

export type StateGetter<State> = () => State
export type StateSetter<State> = (
  action: State | ((last: State) => State),
  ...overloads: any[]
) => void
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
  ...plugins: StorePlugin<State>[]
) => {
  let middlewares: Record<YobtaEvent, MiddleWare<State>[]> = {
    init: [],
    ready: [],
    idle: [],
    next: [],
  }
  let addMiddleware = (
    type: YobtaEvent,
    middleware: MiddleWare<State>,
  ): void => {
    middlewares[type].push(middleware)
  }
  let observers: Observer<any>[] = []

  plugins.forEach(plugin => {
    plugin(addMiddleware)
  })

  let transition = (
    type: YobtaEvent,
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

  let state = transition(INIT, initialState)

  let last: StateGetter<State> = () => state
  let next: StateSetter<State> = (action: any, ...overloads): void => {
    state = transition(
      NEXT,
      isFunction(action) ? action(state) : action,
      ...overloads,
    )
    observers.forEach(observe => {
      observe(state, ...overloads)
    })
  }

  return {
    last,
    next,
    observe: observer => {
      observers.push(observer)

      if (observers.length === 1) {
        state = transition(READY, state)
      }

      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
        if (observers.length === 0) {
          state = transition(IDLE, state)
        }
      }
    },
  }
}
