import {
  observableYobta,
  StorePlugin,
  StateSetter,
  Observer,
} from '../../index.js'

// #region Types
type Transitions<T> = {
  [K in keyof T]: Set<keyof Omit<T, K>>
}

interface MachineFactory {
  <T extends Transitions<T>>(transitions: T): (
    initialState: keyof T,
    ...listeners: StorePlugin<keyof T>[]
  ) => {
    last(): keyof T
    next: StateSetter<keyof T>
    observe(observer: Observer<keyof T>): VoidFunction
  }
}
// #endregion

export const machineYobta: MachineFactory =
  transitions =>
  (initialState, ...listeners) => {
    let store = observableYobta(initialState, ...listeners)

    return {
      ...store,
      next(action, ...overload) {
        let lastState = store.last()
        let nextState =
          typeof action === 'function' ? action(lastState) : action
        let availableTranstions = transitions[lastState]
        // @ts-ignore
        if (availableTranstions.has(nextState)) {
          store.next(nextState, ...overload)
        }
      },
    }
  }
