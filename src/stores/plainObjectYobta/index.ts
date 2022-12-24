import {
  storeYobta,
  YobtaStorePlugin,
  diffObjectYobta,
  YobtaStore,
} from '../../index.js'

// #region Types
type AnyPlainObject = Record<string | number | symbol, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
export type OptionalKey<PlainObject extends AnyPlainObject> = Exclude<
  {
    [K in keyof PlainObject]: PlainObject extends Record<K, PlainObject[K]>
      ? never
      : K
  }[keyof PlainObject],
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
  ): Omit<YobtaStore<State>, 'next'> & {
    assign(patch: Partial<State>, ...overloads: any[]): Partial<State>
    observe(observer: YobtaPlainObjectObserver<State>): VoidFunction
    omit(keys: OptionalKey<State>[]): OptionalKey<State>[]
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
  let { next, last, observe } = storeYobta(initialState, ...listeners)

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
    omit(keys, ...overloads) {
      let state = { ...last() }
      let changes = keys.filter(key => {
        let result = key in state
        if (result) delete state[key]
        return result
      })
      if (changes.length) next(state, changes, ...overloads)
      return changes
    },
  }
}
