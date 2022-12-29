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
  <State, Context = null>(
    initialState: State,
    ...plugins: YobtaStorePlugin<State>[]
  ): {
    last: YobtaStateGetter<State>
    next: YobtaStateSetter<State>
    observe(observer: YobtaObserver<State>, context?: Context): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: State, context: Context, ...overloads: any[]) => void,
      ...overloads: any[]
    ): VoidFunction
  }
}
// #endregion

/**
 * Factory function that creates an observable store.
 *
 * @template State - The type of state that the store will hold.
 * @param {State} initialState - The initial state of the store.
 * @param {...YobtaStorePlugin<State>} plugins - Optional plugins that can modify the store's behavior.
 * @returns {
 *   {
 *     last: YobtaStateGetter<State>;
 *     next: YobtaStateSetter<State>;
 *     observe: (observer: YobtaObserver<State>) => VoidFunction;
 *     on: (event: YobtaStoreEvent, handler: (state: State, context: null, ...overloads: any[]) => void, ...overloads: any[]) => VoidFunction;
 *   }
 *   |
 *   {
 *     last: YobtaStateGetter<State>;
 *     next: YobtaStateSetter<State>;
 *     observe: (observer: YobtaObserver<State>, context: Context) => VoidFunction;
 *     on: (event: YobtaStoreEvent, handler: (state: State, context: Context, ...overloads: any[]) => void, ...overloads: any[]) => VoidFunction;
 *   }
 * } - An object with the following properties:
 *   - last: A function that returns the current state of the store.
 *   - next: A function that updates the state of the store.
 *   - observe: A function that allows an observer to subscribe to state changes in the store.
 *   - on: A function that allows a handler to be registered for a specific store event.
 */
export const storeYobta: YobtaStoreFactory = <State>(
  initialState: State,
  ...plugins: YobtaStorePlugin<State>[]
) => {
  let observable = observableYobta<State>()
  let state: State = initialState
  let context: unknown | null = null
  let { publish, subscribe } = pubSubYobta<Record<YobtaStoreEvent, State>>()
  let next: YobtaStateSetter<State> = (
    nextState: State,
    ...overloads
  ): void => {
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
    action: YobtaStoreEvent,
    updatedState: State,
    ...overloads: any[]
  ): State => {
    let nextState = middleware[action](updatedState, ...overloads)
    publish(action, nextState, context, ...overloads)
    return nextState
  }
  return {
    last,
    next,
    observe: (observer: YobtaObserver<State>, nextContext = null as any) => {
      if (observable.size === 0) {
        context = nextContext
        state = transition(YOBTA_READY, state)
      }
      let unsubscribe = observable.observe(observer)
      return () => {
        unsubscribe()
        if (observable.size === 0) {
          state = transition(YOBTA_IDLE, state)
          context = null
        }
      }
    },
    on: subscribe,
  }
}
