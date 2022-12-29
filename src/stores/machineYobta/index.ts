import {
  storeYobta,
  YobtaStorePlugin,
  YobtaStateSetter,
  YobtaObserver,
  YobtaStoreEvent,
} from '../../index.js'

// #region Types
type TransitionMap<States> = {
  [K in keyof States]: Set<keyof Omit<States, K>>
}

interface MachineFactory {
  <States extends TransitionMap<States>>(transitions: States): (
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States>[]
  ) => {
    last(): keyof States
    next: YobtaStateSetter<keyof States>
    observe(observer: YobtaObserver<keyof States>): VoidFunction
    on(
      event: YobtaStoreEvent,
      handler: (state: keyof States, ...overloads: any[]) => void,
      ...overloads: any[]
    ): VoidFunction
  }
}
// #endregion

/**
 * Creates a state machine with a given set of transitions.
 *
 * @template T - A type that represents the states of the machine and the transitions between them.
 * @param {T} transitions - An object that defines the transitions between states. The keys of the object represent the starting states, and the values are sets of possible ending states.
 * @param {keyof T} initialState - The initial state of the machine.
 * @param {...YobtaStorePlugin<keyof T>} plugins - Any number of store plugins to enhace the store.
 * @returns {Object} An object with the following methods:
 *  - last: Returns the current state of the machine.
 *  - next: Sets the next state of the machine. If the provided state is not a valid transition from the current state, the state is not changed.
 *  - observe: Registers an observer function to be called whenever the state of the machine changes.
 */
export const machineYobta: MachineFactory =
  <States extends TransitionMap<States>>(transitions: States) =>
  (
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States>[]
  ) => {
    let { last, next, on, observe } = storeYobta<keyof States>(
      initialState,
      ...plugins,
    )
    return {
      last,
      next(state: keyof States, ...overloads) {
        let availableTranstions: Set<keyof States> = transitions[last()]
        if (availableTranstions.has(state)) next(state, ...overloads)
      },
      observe,
      on,
    }
  }
