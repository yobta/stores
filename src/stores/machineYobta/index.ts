import { storeYobta, StorePlugin, StateSetter, Observer } from '../../index.js'

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
