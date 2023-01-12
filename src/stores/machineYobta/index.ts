import {
  storeYobta,
  YobtaStorePlugin,
  YobtaStateSetter,
  YobtaObserver,
  YobtaPubsubSubscriber,
} from '../../index.js'

// #region Types
type TransitionMap<States> = {
  [K in keyof States]: (keyof Omit<States, K>)[]
}

export type YobtaMachineStore<
  States extends TransitionMap<States>,
  Overloads extends any[] = any[],
> = {
  last(): keyof States
  next: YobtaStateSetter<keyof States, Overloads>
  observe(observer: YobtaObserver<keyof States, Overloads>): VoidFunction
  onReady(handler: YobtaPubsubSubscriber<keyof States, never>): VoidFunction
  onIdle(handler: YobtaPubsubSubscriber<keyof States, never>): VoidFunction
}

interface YobtaMachineStoreFactory {
  <States extends TransitionMap<States>>(transitions: States): <
    Overloads extends any[] = any[],
  >(
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States, Overloads>[]
  ) => YobtaMachineStore<States, Overloads>
}
// #endregion

/**
 * Creates an observable state machine store.
 *
 * @example
 * const transitions = {
 *  IDLE: ['LOADING'],
 *  LOADING: ['IDLE', 'ERROR'],
 *  ERROR: ['LOADING'],
 * }
 * const machine = machineYobta(transitions)('IDLE')
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/machineYobta/index.md}
 */
export const machineYobta: YobtaMachineStoreFactory =
  <States extends TransitionMap<States>>(transitions: States) =>
  <Overloads extends any[] = any[]>(
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States, Overloads>[]
  ) => {
    let { last, next, observe, onReady, onIdle } = storeYobta<
      keyof States,
      Overloads
    >(initialState, ...plugins)
    return {
      last,
      next(state: keyof States, ...overloads: Overloads) {
        let availableTranstions: (keyof States)[] = transitions[last()]
        if (availableTranstions.includes(state)) next(state, ...overloads)
      },
      observe,
      onReady,
      onIdle,
    }
  }
