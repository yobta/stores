import {
  createStore,
  YobtaStorePlugin,
  diffObjectYobta,
  YobtaStateGetter,
  YobtaWritablePartial,
  YobtaPubsubSubscriber,
  YobtaIdleEvent,
  YobtaReadyEvent,
  YobtaTransitionEvent,
} from '../../index.js'

// #region Types
type AnyPlainObject = Record<string | number | symbol, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
export type OptionalKey<State extends AnyPlainObject> = Exclude<
  {
    [K in keyof State]: State extends Record<K, State[K]> ? never : K
  }[keyof State],
  undefined
>

type ChangesWithOverloads<
  State extends AnyPlainObject,
  Overloads extends any[],
> = [
  Readonly<YobtaWritablePartial<State>> | readonly OptionalKey<State>[],
  ...Overloads,
]

export type YobtaPlainObjectStore<
  State extends AnyPlainObject,
  Overloads extends any[] = any[],
> = {
  assign(
    patch: YobtaWritablePartial<State>,
    ...overloads: Overloads
  ): YobtaWritablePartial<State>
  last: YobtaStateGetter<State>
  observe(
    observer: YobtaPubsubSubscriber<
      [Readonly<State>, ...ChangesWithOverloads<State, Overloads>]
    >,
  ): VoidFunction
  // oberve(
  //   observer: (
  //     state: Readonly<State>,
  //     changes:
  //       | Readonly<YobtaWritablePartial<State>>
  //       | readonly OptionalKey<State>[],
  //     ...overloads: Overloads
  //   ) => void,
  // ): VoidFunction
  omit(
    keys: OptionalKey<State>[],
    ...overloads: Overloads
  ): OptionalKey<State>[]
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: Readonly<State>) => void,
  ): VoidFunction
}
interface YobtaPlainObjectStoreFactory {
  <State extends AnyPlainObject, Overloads extends any[] = any[]>(
    initialState: State,
    ...plugins: YobtaStorePlugin<
      State,
      ChangesWithOverloads<State, Overloads>
    >[]
  ): YobtaPlainObjectStore<State, Overloads>
}
// #endregion

/**
 * Creates an observable store that holds an immutable value.
 *
 * @example
 * const store = createPlainObjectStore({
 *  foo: 'bar',
 *  baz: 123,
 * })
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createPlainObjectStore/index.md}
 */
export const createPlainObjectStore: YobtaPlainObjectStoreFactory = <
  State extends AnyPlainObject,
  Overloads extends any[],
>(
  initialState: State,
  ...listeners: YobtaStorePlugin<
    State,
    ChangesWithOverloads<State, Overloads>
  >[]
) => {
  let { next, last, observe, on } = createStore<
    State,
    ChangesWithOverloads<State, Overloads>
  >(initialState, ...listeners)
  return {
    assign(patch, ...overloads: Overloads) {
      let diff = diffObjectYobta(patch, last())
      if (Object.keys(diff).length) {
        next({ ...last(), ...diff }, diff, ...overloads)
      }
      return diff
    },
    last,
    observe,
    omit(keys: OptionalKey<State>[], ...overloads: Overloads) {
      let state = { ...last() }
      let changes = keys.filter(key => {
        let result = key in state
        if (result) delete state[key]
        return result
      })
      if (changes.length) next(state, changes, ...overloads)
      return changes
    },
    on,
  }
}
