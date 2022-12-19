import { Store, storeYobta, StorePlugin, OptionalKey } from '../../index.js'

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

interface MapFactory {
  <PlainState extends YobtaAnyPlainObject>(
    initialState: PlainState,
    ...listeners: StorePlugin<YobtaMapState<PlainState>>[]
  ): Omit<Store<YobtaMapState<PlainState>>, 'next'> & {
    assign(patch: Partial<PlainState>, ...overloads: any[]): void
    observe(observer: YobtaMapObserver<PlainState>): VoidFunction
    omit(keys: OptionalKey<PlainState>[], ...overloads: any[]): void
  }
}
// #endregion

export const mapYobta: MapFactory = (plainState, ...listeners) => {
  let initialState: YobtaAnyMap = new Map(Object.entries(plainState))
  let { next, ...store } = storeYobta(initialState, ...listeners)

  return {
    ...store,
    assign(patch, ...overloads) {
      let state = store.last()
      let changes = Object.entries(patch).filter(
        ([key, value]) => value !== state.get(key),
      )
      if (changes.length) {
        changes.forEach(([key, value]) => state.set(key, value))
        next(state, changes, ...overloads)
      }
    },
    omit(keys, ...overloads) {
      let state = store.last()
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
