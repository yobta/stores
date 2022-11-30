import {
  ObservableStore,
  observableYobta,
  StorePlugin,
  OptionalKey,
} from '../../index.js'

// #region Types
export type MapKey = string | number | symbol
type AnyPlainObject = Record<MapKey, any>
export type AnyMap = Map<MapKey, any>
type MapState<PlainState extends AnyPlainObject> = Map<
  keyof PlainState,
  PlainState[keyof PlainState]
>
type Entries<PlainObject> = {
  [K in keyof PlainObject]: [K, PlainObject[K]]
}[keyof PlainObject][]
export interface MapObserver<PlainState extends AnyPlainObject> {
  (
    state: MapState<PlainState>,
    changes: Entries<PlainState>,
    ...overloads: any[]
  ): void
}

interface MapFactory {
  <PlainState extends AnyPlainObject>(
    initialState: PlainState,
    ...listeners: StorePlugin<MapState<PlainState>>[]
  ): Omit<ObservableStore<MapState<PlainState>>, 'next'> & {
    assign(patch: Partial<PlainState>, ...overloads: any[]): void
    observe(observer: MapObserver<PlainState>): VoidFunction
    omit(keys: OptionalKey<PlainState>[], ...overloads: any[]): void
  }
}
// #endregion

export const mapYobta: MapFactory = (plainState, ...listeners) => {
  let initialState: AnyMap = new Map(Object.entries(plainState))
  let { next, ...store } = observableYobta(initialState, ...listeners)

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
      let changes = keys.reduce<MapKey[]>((acc, key) => {
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
