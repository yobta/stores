import {
  storeYobta,
  YobtaStorePlugin,
  OptionalKey,
  diffMapYobta,
  YobtaStateGetter,
  YobtaStoreSubscriberEvent,
  YobtaObserver,
} from '../../index.js'

// #region Types
type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? A
  : B
type WritableKeyOf<PlainObject extends YobtaAnyPlainObject> = {
  [Key in keyof PlainObject]: IfEquals<
    { [Q in Key]: PlainObject[Key] },
    { -readonly [Q in Key]: PlainObject[Key] },
    Key,
    never
  >
}[keyof PlainObject]
export type YobtaWritablePartial<PlainState extends YobtaAnyPlainObject> =
  Partial<Pick<PlainState, WritableKeyOf<PlainState>>>

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
type YobtaMapAssigned<PlainState extends YobtaAnyPlainObject> = YobtaMapState<
  YobtaWritablePartial<PlainState>
>
type YobtaOmittedKeysSet<PlainState extends YobtaAnyPlainObject> = Set<
  keyof PlainState
>
type YobtaMapChanges<PlainState extends YobtaAnyPlainObject> =
  | YobtaMapAssigned<PlainState>
  | YobtaOmittedKeysSet<PlainState>

interface YobtaMapFactory {
  <PlainState extends YobtaAnyPlainObject, Overloads extends any[] = any[]>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<
      YobtaMapState<PlainState>,
      [YobtaMapChanges<PlainState>, ...Overloads]
    >[]
  ): {
    assign(
      patch: YobtaWritablePartial<PlainState>,
      ...overloads: Overloads
    ): YobtaMapAssigned<PlainState>
    last: YobtaStateGetter<YobtaMapState<PlainState>>
    observe(
      observer: YobtaObserver<
        YobtaMapState<PlainState>,
        [YobtaMapChanges<PlainState>, ...Overloads]
      >,
    ): VoidFunction
    omit(
      keys: OptionalKey<PlainState>[],
      ...overloads: Overloads
    ): YobtaOmittedKeysSet<PlainState>
    on(
      event: YobtaStoreSubscriberEvent,
      handler: (state: YobtaMapState<PlainState>) => void,
    ): VoidFunction
  }
}
// #endregion

export const mapYobta: YobtaMapFactory = <
  PlainState extends YobtaAnyPlainObject,
  Overloads extends any[] = any[],
>(
  plainState: PlainState,
  ...plugins: any[]
) => {
  let initialState: YobtaMapState<PlainState> = new Map(
    Object.entries(plainState),
  )
  let { next, last, observe, on } = storeYobta<
    YobtaMapState<PlainState>,
    [YobtaMapChanges<PlainState>, ...Overloads]
  >(initialState, ...plugins)
  return {
    assign(patch, ...overloads: Overloads) {
      let state = new Map(last())
      let changes = diffMapYobta(
        new Map(Object.entries(patch)),
        state,
      ) as YobtaMapAssigned<PlainState>
      if (changes.size) {
        changes.forEach((value, key) =>
          state.set(key, value as PlainState[keyof PlainState]),
        )
        next(state, changes, ...overloads)
      }
      return changes
    },
    last,
    observe,
    omit(keys: OptionalKey<PlainState>[], ...overloads: Overloads) {
      let state = new Map(last())
      let changes: YobtaOmittedKeysSet<YobtaAnyPlainObject> = keys.reduce<
        YobtaOmittedKeysSet<YobtaAnyPlainObject>
      >((acc, key) => {
        let result = state.delete(key)
        if (result) acc.add(key)
        return acc
      }, new Set())
      if (changes.size) next(state, changes, ...overloads)
      return changes
    },
    on,
  }
}
