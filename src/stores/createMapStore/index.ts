import {
  createStore,
  YobtaStorePlugin,
  OptionalKey,
  diffMap,
  YobtaStateGetter,
  YobtaPubsubSubscriber,
  YobtaReadyEvent,
  YobtaIdleEvent,
  YobtaTransitionEvent,
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
type YobtaReadonlyMapState<PlainState extends YobtaAnyPlainObject> =
  ReadonlyMap<keyof PlainState, PlainState[keyof PlainState]>
type YobtaMapAssigned<PlainState extends YobtaAnyPlainObject> =
  YobtaReadonlyMapState<YobtaWritablePartial<PlainState>>
type YobtaOmittedKeysSet<PlainState extends YobtaAnyPlainObject> = ReadonlySet<
  OptionalKey<PlainState>
>
type YobtaMapChanges<PlainState extends YobtaAnyPlainObject> =
  | YobtaReadonlyMapState<YobtaWritablePartial<PlainState>>
  | YobtaOmittedKeysSet<PlainState>

export type YobtaMapStore<
  PlainState extends YobtaAnyPlainObject,
  Overloads extends any[] = any[],
> = {
  assign(
    patch: YobtaWritablePartial<PlainState>,
    ...overloads: Overloads
  ): YobtaMapAssigned<PlainState>
  last: YobtaStateGetter<YobtaReadonlyMapState<PlainState>>
  observe(
    observer: YobtaPubsubSubscriber<
      [
        YobtaReadonlyMapState<PlainState>,
        YobtaMapChanges<PlainState>,
        ...Overloads,
      ]
    >,
  ): VoidFunction
  // observe(
  //   observer: (
  //     state: YobtaReadonlyMapState<PlainState>,
  //     changes: YobtaMapChanges<PlainState>,
  //     ...overloads: Overloads
  //   ) => void,
  // ): VoidFunction
  omit(
    keys: OptionalKey<PlainState>[],
    ...overloads: Overloads
  ): YobtaOmittedKeysSet<PlainState>
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: YobtaReadonlyMapState<PlainState>) => void,
  ): VoidFunction
}
interface YobtaMapStoreFactory {
  <PlainState extends YobtaAnyPlainObject, Overloads extends any[] = any[]>(
    initialState: PlainState,
    ...plugins: YobtaStorePlugin<
      YobtaMapState<PlainState>,
      [YobtaMapChanges<PlainState>, ...Overloads]
    >[]
  ): YobtaMapStore<PlainState, Overloads>
}
// #endregion

/**
 * Creates an observable object that stores value as a JavaScript Map object.
 *
 * @example
 * const store = createMapStore({
 *  foo: 'bar',
 *  baz: 123,
 * })
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/stores/createMapStore/index.md}
 */
export const createMapStore: YobtaMapStoreFactory = <
  PlainState extends YobtaAnyPlainObject,
  Overloads extends any[] = any[],
>(
  plainState: PlainState,
  ...plugins: any[]
) => {
  const initialState: YobtaMapState<PlainState> = new Map(
    Object.entries(plainState),
  )
  const { next, last, observe, on } = createStore<
    YobtaMapState<PlainState>,
    [YobtaMapChanges<PlainState>, ...Overloads]
  >(initialState, ...plugins)
  return {
    assign(patch, ...overloads: Overloads) {
      const state = new Map(last())
      const changes = diffMap(
        new Map(Object.entries(patch)),
        state,
      ) as unknown as YobtaMapAssigned<PlainState>
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
      const state = new Map(last())
      const changes = keys.reduce((acc, key) => {
        const result = state.delete(key)
        if (result) acc.add(key)
        return acc
      }, new Set()) as unknown as YobtaOmittedKeysSet<YobtaAnyPlainObject>
      if (changes.size) next(state, changes, ...overloads)
      return changes
    },
    on,
  }
}
