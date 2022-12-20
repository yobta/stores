import {
  YobtaStore,
  storeYobta,
  YobtaStorePlugin,
  OptionalKey,
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
export interface YobtaMapObserver<PlainState extends YobtaAnyPlainObject> {
  (
    state: YobtaMapState<PlainState>,
    changes: YobtaEntries<PlainState>,
    ...overloads: any[]
  ): void
}

interface YobtaMapFactory {
  <PlainState extends YobtaAnyPlainObject>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<YobtaMapState<PlainState>>[]
  ): Omit<YobtaStore<YobtaMapState<PlainState>>, 'next'> & {
    assign(patch: Partial<PlainState>, ...overloads: any[]): void
    observe(observer: YobtaMapObserver<PlainState>): VoidFunction
    omit(keys: OptionalKey<PlainState>[], ...overloads: any[]): void
  }
}
// #endregion

/**
 * Creates a new Map store using a plain object as the initial state.
 * @param {object} plainState - The initial state of the store.
 * @param {...YobtaPlugin} plugins - Plugins to apply to the store.
 * @returns {YobtaMap} The created Yobta store object.
 */
export const mapYobta: YobtaMapFactory = (plainState, ...plugins) => {
  let initialState: YobtaAnyMap = new Map(Object.entries(plainState))
  let { next, ...store } = storeYobta(initialState, ...plugins)

  return {
    ...store,
    /**
     * Assigns new values to the store.
     * @param {object} patch - The values to assign to the store.
     * @param {...any} overloads - Additional arguments to pass to plugins.
     */
    assign(patch, ...overloads) {
      let state = new Map(store.last())
      let changes = Object.entries(patch).filter(
        ([key, value]) => value !== state.get(key),
      )
      if (changes.length) {
        changes.forEach(([key, value]) => state.set(key, value))
        next(state, changes, ...overloads)
      }
    },
    /**
     * Removes keys from the store.
     * @param {string[]} keys - The keys to remove from the store.
     * @param {...any} overloads - Additional arguments to pass to plugins.
     */
    omit(keys, ...overloads) {
      let state = new Map(store.last())
      let changes = keys.reduce<YobtaMapKey[]>((acc, key) => {
        let result = state.delete(key)
        if (result) acc.push(key)
        return acc
      }, [])
      if (changes.length) {
        next(state, changes, ...overloads)
      }
    },
  }
}
