import {
  createStore,
  YobtaStorePlugin,
  YobtaReadyEvent,
  YobtaIdleEvent,
  YobtaTransitionEvent,
} from '../../index.js'
import { ExpandYobta } from '../../util/ExpandYobta/ExpandYobta.js'

// #region Types
type TransitionMap<States> = {
  [K in keyof States]: (keyof Omit<States, K>)[]
}

export type YobtaMachineStoreTransitions<
  States,
  Overloads extends any[] = any[],
> = ExpandYobta<Record<keyof States, (...overloads: Overloads) => void>>

export type YobtaMachineStore<
  States extends TransitionMap<States>,
  Overloads extends any[] = any[],
> = {
  last(): keyof States
  observe(
    observer: (state: keyof States, ...overloads: Overloads) => void,
  ): VoidFunction
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: keyof States) => void,
  ): VoidFunction
  next: YobtaMachineStoreTransitions<States, Overloads>
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
 * const machine = createMachineStore(transitions)('IDLE')
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createMachineStore/index.md}
 */
export const createMachineStore: YobtaMachineStoreFactory =
  <States extends TransitionMap<States>>(transitions: States) =>
  <Overloads extends any[] = any[]>(
    initialState: keyof States,
    ...plugins: YobtaStorePlugin<keyof States, Overloads>[]
  ) => {
    const { last, next, observe, on } = createStore<keyof States, Overloads>(
      initialState,
      ...plugins,
    )

    return {
      last,
      observe,
      on,
      next: Object.keys(transitions).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (...overloads: Overloads) => {
            const availableTransitions: (keyof States)[] = transitions[last()]
            if (availableTransitions.includes(key as keyof States)) {
              next(key as keyof States, ...overloads)
            }
          },
        }),
        {} as YobtaMachineStoreTransitions<States, Overloads>,
      ),
    }
  }
