import {
  storeYobta,
  YobtaStorePlugin,
  YobtaStateSetter,
  YobtaObserver,
  YobtaStoreEvent,
} from '../../index.js'

// #region Types
type TransitionMap<States> = {
  [K in keyof States]: [keyof Omit<States, K>]
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
 * A factory function for creating an observable state machine stores.
 *
 * @template States - An object type representing the possible states in the machine.
 * @template Overloads - The type(s) of the additional arguments passed to the `next` function.
 *
 * @param {States} transitions - A map of transitions for the machine.
 * @param {keyof States} initialState - The initial state of the machine.
 * @param {...YobtaStorePlugin<keyof States, Overloads>} plugins - The plugins to apply to the Yobta store.
 *
 * @returns {(initialState: keyof States, ...plugins: YobtaStorePlugin<keyof States, Overloads>[]) => {
 *   last: () => keyof States,
 *   next: YobtaStateSetter<keyof States, Overloads>,
 *   observe: (observer: YobtaObserver<keyof States, Overloads>) => VoidFunction,
 *   on: (event: YobtaStoreEvent, handler: (state: keyof States) => void) => VoidFunction
 * }}
 *
 * @example
 * const transitions = {
 *   IDLE: ['LOADING'],
 *   LOADING: ['IDLE', 'ERROR'],
 *   ERROR: ['LOADING'],
 * }
 *
 * const myMachine = machineYobta(transitions)('IDLE')
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
        let availableTranstions: [keyof States] = transitions[last()]
        if (availableTranstions.includes(state)) next(state, ...overloads)
      },
      observe,
      on,
    }
  }
