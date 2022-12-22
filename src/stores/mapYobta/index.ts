import {
  YobtaStore,
  storeYobta,
  YobtaStorePlugin,
  OptionalKey,
  diffMapYobta,
} from '../../index.js'

// #region Types
export type YobtaAnyPlainObject = Record<YobtaMapKey, any>
export type YobtaEntries<PlainObject> = {
  [K in keyof PlainObject]: [K, PlainObject[K]]
}[keyof PlainObject][]

export type YobtaMapKey = string | number | symbol
export type YobtaAnyMap = Map<YobtaMapKey, any>
export type YobtaMapState<PlainState extends YobtaAnyPlainObject> = Map<
  keyof PlainState,
  PlainState[keyof PlainState]
>

type YobtaMapAssignChanges<PlainState extends YobtaAnyPlainObject> =
  YobtaMapState<Partial<PlainState>>
type YobtaMapOmitChanges<PlainState extends YobtaAnyPlainObject> = Set<
  keyof PlainState
>

export type YobtaMapChanges<PlainState extends YobtaAnyPlainObject> =
  | YobtaMapAssignChanges<PlainState>
  | YobtaMapOmitChanges<PlainState>

export interface YobtaMapObserver<PlainState extends YobtaAnyPlainObject> {
  (
    state: YobtaMapState<PlainState>,
    changes: YobtaMapChanges<PlainState>,
    ...overloads: any[]
  ): void
}

/**
 * A factory function that creates a store object that stores state as a Map.
 * @param {YobtaAnyPlainObject} initialState - The plain object to be coverted to a js Map object and used as initial state.
 * @param {YobtaStorePlugin<YobtaMapState<PlainState>>[]} [plugins] - Optional plugins to enhance the store.
 * @returns {Omit<YobtaStore<YobtaMapState<PlainState>>, 'next'> & {
 *   assign(patch: Partial<PlainState>, ...overloads: any[]): YobtaMapAssignChanges<PlainState>
 *   observe(observer: YobtaMapObserver<PlainState>): VoidFunction
 *   omit(keys: OptionalKey<PlainState>[], ...overloads: any[]): YobtaMapOmitChanges<PlainState>
 * }} - A YobtaStore object that stores state as a Map.
 */
interface YobtaMapFactory {
  <PlainState extends YobtaAnyPlainObject>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<YobtaMapState<PlainState>>[]
  ): Omit<YobtaStore<YobtaMapState<PlainState>>, 'next'> & {
    assign(
      patch: Partial<PlainState>,
      ...overloads: any[]
    ): YobtaMapAssignChanges<PlainState>
    observe(observer: YobtaMapObserver<PlainState>): VoidFunction
    omit(
      keys: OptionalKey<PlainState>[],
      ...overloads: any[]
    ): YobtaMapOmitChanges<PlainState>
  }
}
// #endregion

export const mapYobta: YobtaMapFactory = (plainState, ...plugins) => {
  let initialState: YobtaAnyMap = new Map(Object.entries(plainState))
  let { next, ...store } = storeYobta(initialState, ...plugins)
  return {
    ...store,
    assign(patch, ...overloads) {
      let state = new Map(store.last())
      let changes: YobtaMapAssignChanges<YobtaAnyPlainObject> = diffMapYobta(
        new Map(Object.entries(patch)),
        state,
      )
      if (changes.size) {
        changes.forEach((value, key) => state.set(key, value))
        next(state, changes, ...overloads)
      }
      return changes
    },
    omit(keys, ...overloads) {
      let state = new Map(store.last())
      let changes = keys.reduce<YobtaMapOmitChanges<YobtaAnyPlainObject>>(
        (acc, key) => {
          let result = state.delete(key)
          if (result) acc.add(key)
          return acc
        },
        new Set(),
      )
      if (changes.size) next(state, changes, ...overloads)
      return changes
    },
  }
}
