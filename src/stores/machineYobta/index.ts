import {
  storeYobta,
  YobtaStorePlugin,
  YobtaStateSetter,
  YobtaObserver,
} from '../../index.js'

// #region Types

/**
 * A type that represents the transitions between states of a state machine.
 * The keys of the object represent the starting states, and the values are sets of possible ending states.
 *
 * @template T - A type that represents the states of the machine.
 */
type Transitions<T> = {
  [K in keyof T]: Set<keyof Omit<T, K>>
}

/**
 * A factory function that creates a state machine.
 *
 * @template T - A type that represents the states of the machine and the transitions between them.
 * @param {T} transitions - An object that defines the transitions between states.
 * @param {keyof T} initialState - The initial state of the machine.
 * @param {...YobtaStorePlugin<keyof T>} listeners - Any number of listeners to be registered with the store.
 * @returns {Object} An object with the following methods:
 *  - last: Returns the current state of the machine.
 *  - next: Sets the next state of the machine. If the provided state is not a valid transition from the current state, the state is not changed.
 *  - observe: Registers an observer function to be called whenever the state of the machine changes.
 */
interface MachineFactory {
  <T extends Transitions<T>>(transitions: T): (
    initialState: keyof T,
    ...listeners: YobtaStorePlugin<keyof T>[]
  ) => {
    last(): keyof T
    next: YobtaStateSetter<keyof T>
    observe(observer: YobtaObserver<keyof T>): VoidFunction
  }
}
// #endregion

/**
 * Creates a state machine with a given set of transitions.
 *
 * @template T - A type that represents the states of the machine and the transitions between them.
 * @param {T} transitions - An object that defines the transitions between states. The keys of the object represent the starting states, and the values are sets of possible ending states.
 * @param {keyof T} initialState - The initial state of the machine.
 * @param {...YobtaStorePlugin<keyof T>} listeners - Any number of listeners to be registered with the store.
 * @returns {Object} An object with the following methods:
 *  - last: Returns the current state of the machine.
 *  - next: Sets the next state of the machine. If the provided state is not a valid transition from the current state, the state is not changed.
 *  - observe: Registers an observer function to be called whenever the state of the machine changes.
 */
export const machineYobta: MachineFactory =
  transitions =>
  (initialState, ...listeners) => {
    let store = storeYobta(initialState, ...listeners)
    return {
      ...store,
      next(state, ...overload) {
        let availableTranstions = transitions[store.last()]
        // @ts-ignore
        if (availableTranstions.has(state)) store.next(state, ...overload)
      },
    }
  }
