import {
  storeYobta,
  YobtaStorePlugin,
  diffObjectYobta,
  YobtaStateGetter,
  YobtaStoreSubscriberEvent,
  YobtaObserver,
  YobtaWritablePartial,
} from '../../index.js'

// #region Types
type AnyPlainObject = Record<string | number | symbol, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
export type OptionalKey<State extends AnyPlainObject> = Exclude<
  {
    [K in keyof State]: State extends Record<K, State[K]> ? never : K
  }[keyof State],
  undefined
>

type ChangesWithOverloads<
  State extends AnyPlainObject,
  Overloads extends any[],
> = [
  Readonly<YobtaWritablePartial<State>> | readonly OptionalKey<State>[],
  ...Overloads,
]
interface PlainObjectFactory {
  <State extends AnyPlainObject, Overloads extends any[] = any[]>(
    initialState: State,
    ...plugins: YobtaStorePlugin<
      State,
      ChangesWithOverloads<State, Overloads>
    >[]
  ): {
    assign(
      patch: YobtaWritablePartial<State>,
      ...overloads: Overloads
    ): YobtaWritablePartial<State>
    last: YobtaStateGetter<State>
    observe(
      observer: YobtaObserver<State, ChangesWithOverloads<State, Overloads>>,
    ): VoidFunction
    omit(
      keys: OptionalKey<State>[],
      ...overloads: Overloads
    ): OptionalKey<State>[]
    on(
      event: YobtaStoreSubscriberEvent,
      handler: (state: Readonly<State>) => void,
    ): VoidFunction
  }
}
// #endregion

export const plainObjectYobta: PlainObjectFactory = <
  State extends AnyPlainObject,
  Overloads extends any[],
>(
  initialState: State,
  ...listeners: YobtaStorePlugin<
    State,
    ChangesWithOverloads<State, Overloads>
  >[]
) => {
  let { next, last, observe, on } = storeYobta<
    State,
    ChangesWithOverloads<State, Overloads>
  >(initialState, ...listeners)
  return {
    assign(patch, ...overloads: Overloads) {
      let diff = diffObjectYobta(patch, last())
      if (Object.keys(diff).length) {
        next({ ...last(), ...diff }, diff, ...overloads)
      }
      return diff
    },
    last,
    observe,
    omit(keys: OptionalKey<State>[], ...overloads: Overloads) {
      let state = { ...last() }
      let changes = keys.filter(key => {
        let result = key in state
        if (result) delete state[key]
        return result
      })
      if (changes.length) next(state, changes, ...overloads)
      return changes
    },
    on,
  }
}
