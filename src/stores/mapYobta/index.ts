import { ObservableStore, observableYobta, StorePlugin } from '../../index.js'

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
interface MapStore<PlainState extends AnyPlainObject>
  extends Omit<ObservableStore<MapState<PlainState>>, 'next'> {
  assign(patch: Partial<PlainState>, ...overloads: any[]): void
  observe(observer: MapObserver<PlainState>): VoidFunction
}

interface MapFactory {
  <PlainState extends AnyPlainObject>(
    initialState: PlainState,
    ...listeners: StorePlugin<MapState<PlainState>>[]
  ): MapStore<PlainState>
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
        next(new Map([...state, ...changes]), changes, ...overloads)
      }
    },
  }
}
