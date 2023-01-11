import {
  storeYobta,
  YobtaStorePlugin,
  YobtaStateSetter,
  YobtaObserver,
  YobtaStoreEvent,
} from '../../index.js'

// #region Types
type TransitionMap<States> = {
  [K in keyof States]: (keyof Omit<States, K>)[]
}

interface MachineFactory {
  <States extends TransitionMap<States>>(transitions: States): <
    Overloads extends any[] = any[],
  >(
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States, Overloads>[]
  ) => {
    last(): keyof States
    next: YobtaStateSetter<keyof States, Overloads>
    observe(observer: YobtaObserver<keyof States, Overloads>): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: keyof States) => void,
    ): VoidFunction
  }
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
export const machineYobta: MachineFactory =
  <States extends TransitionMap<States>>(transitions: States) =>
  <Overloads extends any[] = any[]>(
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States, Overloads>[]
  ) => {
    let { last, next, on, observe } = storeYobta<keyof States, Overloads>(
      initialState,
      ...plugins,
    )
    return {
      last,
      next(state: keyof States, ...overloads: Overloads) {
        let availableTranstions: (keyof States)[] = transitions[last()]
        if (availableTranstions.includes(state)) next(state, ...overloads)
      },
      observe,
      on,
    }
  }
