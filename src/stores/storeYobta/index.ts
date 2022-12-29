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
  <State>(initialState: State, ...plugins: YobtaStorePlugin<State>[]): {
    last: YobtaStateGetter<State>
    next: YobtaStateSetter<State>
    observe(observer: YobtaObserver<State>): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: State, ...overloads: any[]) => void,
      ...overloads: any[]
    ): VoidFunction
  }
}
// #endregion

/**
 * Creates a new observable store.
 *
 * @template State The type of the state object in the store.
 * @param {State} initialState The initial state of the store.
 * @param {...YobtaStorePlugin<State>[]} plugins An optional list of plugins that can modify the store.
 * @returns {Object} An object containing functions for interacting with the store.
 * @property {YobtaStateGetter<State>} last A function that returns the current state of the store.
 * @property {YobtaStateSetter<State>} next A function that updates the state of the store.
 * @property {(observer: YobtaObserver<State>) => VoidFunction} observe A function that registers an observer to be notified of state changes.
 * @property {(event: YobtaStoreEvent, handler: (state: State, ...overloads: any[]) => void, ...overloads: any[]) => VoidFunction} on A function that registers an event handler to be called when a particular event is published by the store.
 */
export const storeYobta: YobtaStoreFactory = <State>(
  initialState: State,
  ...plugins: YobtaStorePlugin<State>[]
) => {
  let observable = observableYobta<State>()
  let state: State = initialState
  let locked: boolean
  let { publish, subscribe } = pubSubYobta<Record<YobtaStoreEvent, State>>()
  let next: YobtaStateSetter<State> = (
    nextState: State,
    ...overloads
  ): void => {
    if (locked) throw new Error("Can't update state while updating state.")
    state = transition(YOBTA_NEXT, nextState, ...overloads)
    observable.next(state, ...overloads)
  }
  let last: YobtaStateGetter<State> = () => state
  let middleware = composeMiddleware<State>({
    initialState,
    last,
    next,
    plugins,
  })
  let transition = (
    topic: YobtaStoreEvent,
    updatedState: State,
    ...overloads: any[]
  ): State => {
    locked = true
    let nextState = middleware[topic](updatedState, ...overloads)
    publish(topic, nextState, ...overloads)
    locked = false
    return nextState
  }
  return {
    last,
    next,
    observe: (observer: YobtaObserver<State>) => {
      if (observable.size === 0) {
        state = transition(YOBTA_READY, state)
      }
      let unsubscribe = observable.observe(observer)
      return () => {
        unsubscribe()
        if (observable.size === 0) {
          state = transition(YOBTA_IDLE, state)
        }
      }
    },
    on: subscribe,
  }
}
