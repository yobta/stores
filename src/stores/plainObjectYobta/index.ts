import {
  storeYobta,
  YobtaStorePlugin,
  diffObjectYobta,
  YobtaStoreEvent,
  YobtaStateGetter,
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

type YobtaPlainObjectAssignChanges<State extends AnyPlainObject> =
  Partial<State>
type YobtaPlainObjectOmitChanges<State extends AnyPlainObject> =
  OptionalKey<State>[]

export type YobtaPlainObjectChanges<State extends AnyPlainObject> =
  | YobtaPlainObjectAssignChanges<State>
  | YobtaPlainObjectOmitChanges<State>
export interface YobtaPlainObjectObserver<State extends AnyPlainObject> {
  (
    state: State,
    changes: YobtaPlainObjectChanges<State>,
    ...overloads: any[]
  ): void
}

interface PlainObjectFactory {
  <State extends AnyPlainObject>(
    initialState: State,
    ...listeners: YobtaStorePlugin<State>[]
  ): {
    assign(patch: Partial<State>, ...overloads: any[]): Partial<State>
    last: YobtaStateGetter<State>
    observe(observer: YobtaPlainObjectObserver<State>): VoidFunction
    omit(keys: OptionalKey<State>[], ...overloads: any[]): OptionalKey<State>[]
    on(
      event: YobtaStoreEvent,
      handler: (state: State, ...overloads: any[]) => void,
      ...overloads: any[]
    ): VoidFunction
  }
}

// #endregion

/**
 * Creates a new Yobta store for plain objects.
 *
 * @template State - The type of the state object being managed by the store.
 * @param {State} initialState - The initial state of the store.
 * @param {YobtaStorePlugin<State>[]} listeners - An optional list of plugins to apply to the store.
 * @returns {
 *   assign(patch: Partial<State>, ...overloads: any[]): Partial<State>;
 *   last(): State;
 *   observe(observer: YobtaPlainObjectObserver<State>): VoidFunction;
 *   omit(keys: OptionalKey<State>[]): OptionalKey<State>[];
 * } - The created Yobta store.
 */
export const plainObjectYobta: PlainObjectFactory = <
  State extends AnyPlainObject,
>(
  initialState: State,
  ...listeners: YobtaStorePlugin<State>[]
) => {
  let { next, last, observe, on } = storeYobta<State>(
    initialState,
    ...listeners,
  )

  return {
    assign(patch, ...overloads) {
      let diff = diffObjectYobta(patch, last())
      if (Object.keys(diff).length) {
        next({ ...last(), ...diff }, diff, ...overloads)
      }
      return diff
    },
    last,
    observe,
    omit(keys: OptionalKey<State>[], ...overloads) {
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
