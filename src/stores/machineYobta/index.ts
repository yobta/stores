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
  <States extends TransitionMap<States>, Overloads extends any[] = any[]>(
    transitions: States,
  ): (
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

export const machineYobta: MachineFactory =
  <States extends TransitionMap<States>, Overloads extends any[]>(
    transitions: States,
  ) =>
  (
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
        let availableTranstions: Set<keyof States> = transitions[last()]
        if (availableTranstions.has(state)) next(state, ...overloads)
      },
      observe,
      on,
    }
  }
