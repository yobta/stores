import {
  storeYobta,
  YobtaStorePlugin,
  OptionalKey,
  diffMapYobta,
  YobtaStateGetter,
  YobtaStoreEvent,
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
interface YobtaMapFactory {
  <PlainState extends YobtaAnyPlainObject, Context = null>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<YobtaMapState<PlainState>>[]
  ): {
    assign(
      patch: Partial<PlainState>,
      ...overloads: any[]
    ): YobtaMapAssignChanges<PlainState>
    last: YobtaStateGetter<YobtaMapState<PlainState>>
    observe(
      observer: YobtaMapObserver<PlainState>,
      context?: Context,
    ): VoidFunction
    omit(
      keys: OptionalKey<PlainState>[],
      ...overloads: any[]
    ): YobtaMapOmitChanges<PlainState>
    on(
      event: YobtaStoreEvent,
      handler: (
        state: YobtaMapState<PlainState>,
        context: Context,
        ...overloads: any[]
      ) => void,
      ...overloads: any[]
    ): VoidFunction
  }
}
// #endregion

export const mapYobta: YobtaMapFactory = <
  PlainState extends YobtaAnyPlainObject,
  Context,
>(
  plainState: PlainState,
  ...plugins: any[]
) => {
  let initialState: YobtaMapState<PlainState> = new Map(
    Object.entries(plainState),
  )
  let { next, last, observe, on } = storeYobta<
    YobtaMapState<PlainState>,
    Context
  >(initialState, ...plugins)
  return {
    assign(patch, ...overloads) {
      let state = new Map(last())
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
    last,
    observe,
    omit(keys: OptionalKey<PlainState>[], ...overloads) {
      let state = new Map(last())
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
    on,
  }
}
