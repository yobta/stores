import {
  observableYobta,
  YobtaObserver,
} from '../../util/observableYobta/index.js'

// #region Types
export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'

export type YobtaStoreEvent =
  | typeof YOBTA_READY
  | typeof YOBTA_IDLE
  | typeof YOBTA_NEXT

export type YobtaStoreMiddleware<State> = (
  state: State,
  ...overloads: any[]
) => State

export type YobtaStorePlugin<State> = (props: {
  addMiddleware(
    type: YobtaStoreEvent,
    middleware: YobtaStoreMiddleware<State>,
  ): void
  initialState: State
  next: YobtaStateSetter<State>
  last(): State
}) => void

export type YobtaStateGetter<State> = () => State
export type YobtaStateSetter<State> = (
  action: State,
  ...overloads: any[]
) => void

interface YobtaStoreFactory {
  <State>(
    initialState: State,
    ...plugins: YobtaStorePlugin<State>[]
  ): YobtaStore<State>
}

export interface YobtaStore<State> {
  last: YobtaStateGetter<State>
  next: YobtaStateSetter<State>
  observe(observer: YobtaObserver<State>): VoidFunction
}
// #endregion

/**
 * Creates a new observable store.
 *
 * @param {State} initialState The initial state for the store.
 * @param {YobtaStorePlugin<State>[]} plugins An array of plugins to apply to the store.
 * @returns {YobtaStore<State>} A new observable store.
 */
export const storeYobta: YobtaStoreFactory = <State>(
  initialState: State,
  ...plugins: YobtaStorePlugin<State>[]
) => {
  let middlewares: Record<YobtaStoreEvent, YobtaStoreMiddleware<State>[]> = {
    ready: [],
    idle: [],
    next: [],
  }
  let addMiddleware = (
    type: YobtaStoreEvent,
    middleware: YobtaStoreMiddleware<State>,
  ): void => {
    middlewares[type].push(middleware)
  }
  let observable = observableYobta<State>()
  let state: State = initialState
  let next: YobtaStateSetter<State> = (
    nextState: State,
    ...overloads
  ): void => {
    state = transition(YOBTA_NEXT, nextState, ...overloads)
    observable.next(state, ...overloads)
  }
  let last: YobtaStateGetter<State> = () => state
  plugins.forEach(plugin => {
    plugin({ addMiddleware, initialState, next, last })
  })
  let transition = (
    type: YobtaStoreEvent,
    nextState: any,
    ...overloads: any[]
  ): State =>
    middlewares[type].reduceRight<State>(
      (acc, right) => right(acc, ...overloads),
      nextState,
    )
  return {
    last,
    next,
    observe: (observer: YobtaObserver<State>) => {
      if (observable.size === 0) state = transition(YOBTA_READY, state)
      let unsubscribe = observable.observe(observer)
      return () => {
        unsubscribe()
        if (observable.size === 0) state = transition(YOBTA_IDLE, state)
      }
    },
  }
}
