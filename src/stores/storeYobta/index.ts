import {
  pubSubYobta,
  YobtaPubsubSubscriber,
} from '../../util/pubSubYobta/index.js'
import { composeMiddleware } from './middleware.js'

// #region Types
export const YOBTA_READY = 'ready'
export const YOBTA_IDLE = 'idle'
export const YOBTA_NEXT = 'next'
export const YOBTA_BEFORE = 'before'
export type YobtaReadyEvent = typeof YOBTA_READY
export type YobtaIdleEvent = typeof YOBTA_IDLE
export type YobtaNextEvent = typeof YOBTA_NEXT
export type YobtaTrnsitionsEvent = typeof YOBTA_BEFORE
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
  observe(
    observer: YobtaPubsubSubscriber<[Readonly<State>, ...Overloads]>,
  ): VoidFunction
  onReady(handler: YobtaPubsubSubscriber<[Readonly<State>]>): VoidFunction
  onIdle(handler: YobtaPubsubSubscriber<[Readonly<State>]>): VoidFunction
  onBeforeUpdate(
    handler: YobtaPubsubSubscriber<[Readonly<State>]>,
  ): VoidFunction
}
interface YobtaStoreFactory {
  <State, Overloads extends any[] = any[]>(
    initialState: State,
    ...plugins: YobtaStorePlugin<State, Overloads>[]
  ): YobtaStore<State, Overloads>
}
type Topics<State, Overloads extends any[]> = {
  [YOBTA_BEFORE]: [Readonly<State>]
  [YOBTA_IDLE]: [Readonly<State>]
  [YOBTA_NEXT]: [Readonly<State>, ...Overloads]
  [YOBTA_READY]: [Readonly<State>]
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
  let state: State = initialState
  let { publish, subscribe, getSize } = pubSubYobta<Topics<State, Overloads>>()
  let next: YobtaStateSetter<State, Overloads> = (
    nextState: State,
    ...overloads
  ): void => {
    state = transition(YOBTA_NEXT, nextState, ...overloads)
    publish(YOBTA_NEXT, state, ...overloads)
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
    publish(YOBTA_BEFORE, nextState)
    return nextState
  }
  return {
    last,
    next,
    observe: (
      observer: YobtaPubsubSubscriber<[Readonly<State>, ...Overloads]>,
    ) => {
      if (getSize(YOBTA_NEXT) === 0) {
        state = transition(YOBTA_READY, state)
        publish(YOBTA_READY, state)
      }
      let unsubscribe = subscribe(YOBTA_NEXT, observer)
      return () => {
        unsubscribe()
        if (getSize(YOBTA_NEXT) === 0) {
          state = transition(YOBTA_IDLE, state)
          publish(YOBTA_IDLE, state)
        }
      }
    },
    onReady: (cb: YobtaPubsubSubscriber<[Readonly<State>]>) =>
      subscribe(YOBTA_READY, cb),
    onIdle: (cb: YobtaPubsubSubscriber<[Readonly<State>]>) =>
      subscribe(YOBTA_IDLE, cb),
    onBeforeUpdate: (cb: YobtaPubsubSubscriber<[Readonly<State>]>) =>
      subscribe(YOBTA_BEFORE, cb),
  }
}
