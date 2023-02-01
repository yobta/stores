import { YobtaObserver } from '../../util/observableYobta/index.js'
import { pubSubYobta } from '../../util/pubSubYobta/index.js'
import { composeMiddleware } from './middleware.js'

// #region Types
export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'
export const YOBTA_BEFORE = 'before'
export type YobtaReadyEvent = typeof YOBTA_READY
export type YobtaIdleEvent = typeof YOBTA_IDLE
export type YobtaNextEvent = typeof YOBTA_NEXT
export type YobtaTransitionEvent = typeof YOBTA_BEFORE
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
export type YobtaStoreObserver<State, Overloads extends any[]> = (
  state: Readonly<State>,
  ...overloads: Overloads
) => void
export type YobtaStore<State, Overloads extends any[] = any[]> = {
  last: YobtaStateGetter<State>
  next: YobtaStateSetter<State, Overloads>
  observe(
    observer: YobtaStoreObserver<State, Overloads>,
    ...callbacks: VoidFunction[]
  ): VoidFunction
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: Readonly<State>) => void,
  ): VoidFunction
}
interface YobtaStoreFactory {
  <State, Overloads extends any[] = any[]>(
    initialState: State,
    ...plugins: YobtaStorePlugin<State, Overloads>[]
  ): YobtaStore<State, Overloads>
}
type Topics<State> = {
  [YOBTA_BEFORE]: [Readonly<State>]
  [YOBTA_IDLE]: [Readonly<State>]
  [YOBTA_READY]: [Readonly<State>]
}
type YobtaStackItem<State, Overloads extends any[]> = [
  YobtaStoreObserver<State, Overloads>,
  VoidFunction[],
]
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
  let state: State = initialState
  let { publish: p, subscribe: on } = pubSubYobta<Topics<State>>()
  let stack = new Set<YobtaStackItem<State, Overloads>>()
  let next: YobtaStateSetter<State, Overloads> = (
    nextState: State,
    ...overloads
  ): void => {
    state = transition(YOBTA_NEXT, nextState, ...overloads)
    let observers = new Set<YobtaObserver<State, Overloads>>()
    let callbacks = new Set<VoidFunction>()
    stack.forEach(([observer, callbackArray]) => {
      observers.add(observer)
      callbackArray.forEach(callback => {
        callbacks.add(callback)
      })
    })
    observers.forEach(observer => {
      observer(state, ...overloads)
    })
    callbacks.forEach(callback => {
      callback()
    })
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
  ): State => {
    let nextState = middleware[topic](updatedState, ...overloads)
    p(YOBTA_BEFORE, nextState)
    return nextState
  }
  return {
    last,
    next,
    observe: (
      observer: YobtaStoreObserver<State, Overloads>,
      ...callbacks: VoidFunction[]
    ) => {
      if (stack.size === 0) {
        state = transition(YOBTA_READY, state)
        p(YOBTA_READY, state)
      }
      let item: YobtaStackItem<State, Overloads> = [observer, callbacks]
      stack.add(item)
      return () => {
        stack.delete(item)
        if (stack.size === 0) {
          state = transition(YOBTA_IDLE, state)
          p(YOBTA_IDLE, state)
        }
      }
    },
    on,
  }
}
