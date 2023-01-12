import {
  observableYobta,
  YobtaObserver,
} from '../../util/observableYobta/index.js'
import { pubSubYobta } from '../../util/pubSubYobta/index.js'
import { composeMiddleware } from './middleware.js'

// #region Types
export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'
export type YobtaReadyEvent = typeof YOBTA_READY
export type YobtaIdleEvent = typeof YOBTA_IDLE
export type YobtaNextEvent = typeof YOBTA_NEXT
export type YobtaStoreEvent = YobtaReadyEvent | YobtaIdleEvent | YobtaNextEvent
export type YobtaStoreSubscriberEvent = YobtaReadyEvent | YobtaIdleEvent
export type YobtaStoreMiddleware<State, Overloads extends any[]> = (
  state: Readonly<State>,
  ...overloads: Overloads
) => State

export type YobtaAddMiddleware<State, Overloads extends any[]> = {
  (
    type: YobtaReadyEvent | YobtaIdleEvent,
    middleware: YobtaStoreMiddleware<State, never>,
  ): void
  (
    type: YobtaNextEvent,
    middleware: YobtaStoreMiddleware<State, Overloads>,
  ): void
}
export type YobtaStorePlugin<State, Overloads extends any[]> = (props: {
  addMiddleware: YobtaAddMiddleware<State, Overloads>
  initialState: State
  next: YobtaStateSetter<State, Overloads>
  last(): State
}) => void
export type YobtaStateGetter<State> = () => Readonly<State>
export type YobtaStateSetter<State, Overloads extends any[]> = (
  action: State,
  ...overloads: Overloads
) => void

export type YobtaStore<State, Overloads extends any[] = any[]> = {
  last: YobtaStateGetter<State>
  next: YobtaStateSetter<State, Overloads>
  observe(observer: YobtaObserver<State, Overloads>): VoidFunction
  on(
    event: YobtaStoreSubscriberEvent,
    handler: (state: Readonly<State>) => void,
  ): VoidFunction
}

interface YobtaStoreFactory {
  <State, Overloads extends any[] = any[]>(
    initialState: State,
    ...plugins: YobtaStorePlugin<State, Overloads>[]
  ): YobtaStore<State, Overloads>
}
// #endregion

/**
 * Creates an observable store object.
 * @example
 * const store = storeYobta('initial state')
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/storeYobta/index.md}
 */
export const storeYobta: YobtaStoreFactory = <
  State,
  Overloads extends any[] = never[],
>(
  initialState: State,
  ...plugins: YobtaStorePlugin<State, Overloads>[]
) => {
  let observable = observableYobta<State, Overloads>()
  let state: State = initialState
  let { publish, subscribe } =
    pubSubYobta<Record<YobtaStoreSubscriberEvent, State>>()
  let next: YobtaStateSetter<State, Overloads> = (
    nextState: State,
    ...overloads
  ): void => {
    state = transition(YOBTA_NEXT, nextState, ...overloads)
    observable.next(state, ...overloads)
  }
  let last: YobtaStateGetter<State> = () => state
  let middleware = composeMiddleware<State, Overloads>({
    initialState,
    last,
    next,
    plugins,
  })
  let transition = (
    topic: YobtaStoreEvent,
    updatedState: State,
    ...overloads: any
  ): State => middleware[topic](updatedState, ...overloads)
  return {
    last,
    next,
    observe: (observer: YobtaObserver<State, Overloads>) => {
      if (observable.size === 0) {
        state = transition(YOBTA_READY, state)
        publish(YOBTA_READY, state)
      }
      let unsubscribe = observable.observe(observer)
      return () => {
        unsubscribe()
        if (observable.size === 0) {
          state = transition(YOBTA_IDLE, state)
          publish(YOBTA_IDLE, state)
        }
      }
    },
    on: subscribe,
  }
}
