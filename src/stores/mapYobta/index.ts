import {
  storeYobta,
  YobtaStorePlugin,
  OptionalKey,
  diffMapYobta,
  YobtaStateGetter,
  YobtaStoreSubscriberEvent,
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
type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? A
  : B

type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P,
    never
  >
}[keyof T]

export type YobtaPatch<PlainState> = Partial<
  Pick<PlainState, WritableKeysOf<PlainState>>
>
interface YobtaMapFactory {
  <PlainState extends YobtaAnyPlainObject, Overloads extends any[] = any[]>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<
      YobtaMapState<PlainState>,
      [YobtaMapChanges<PlainState>, ...Overloads]
    >[]
  ): {
    assign(
      patch: YobtaPatch<PlainState>,
      ...overloads: Overloads
    ): YobtaMapAssignChanges<PlainState>
    last: YobtaStateGetter<YobtaMapState<PlainState>>
    observe(observer: YobtaMapObserver<PlainState>): VoidFunction
    omit(
      keys: OptionalKey<PlainState>[],
      ...overloads: Overloads
    ): YobtaMapOmitChanges<PlainState>
    on(
      event: YobtaStoreSubscriberEvent,
      handler: (state: YobtaMapState<PlainState>) => void,
    ): VoidFunction
  }
}
// #endregion

export const mapYobta: YobtaMapFactory = <
  PlainState extends YobtaAnyPlainObject,
>(
  plainState: PlainState,
  ...plugins: any[]
) => {
  let initialState: YobtaMapState<PlainState> = new Map(
    Object.entries(plainState),
  )
  let { next, last, observe, on } = storeYobta<YobtaMapState<PlainState>>(
    initialState,
    ...plugins,
  )
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
