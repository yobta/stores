import { Store, storeYobta, StorePlugin } from '../../index.js'

// #region Types
type AnyPlainObject = Record<string | number | symbol, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
export type OptionalKey<PlainObject extends AnyPlainObject> = Exclude<
  {
    [K in keyof PlainObject]: PlainObject extends Record<K, PlainObject[K]>
      ? never
      : K
  }[keyof PlainObject],
  undefined
>

interface PlainObjectStore<State extends AnyPlainObject> extends Store<State> {
  assign(patch: Partial<State>): void
  omit(...keys: OptionalKey<State>[]): OptionalKey<State>[]
}

interface PlainObjectFactory {
  <State extends AnyPlainObject>(
    initialState: State,
    ...listeners: StorePlugin<State>[]
  ): PlainObjectStore<State>
}
// #endregion

export const plainObjectYobta: PlainObjectFactory = <
  State extends AnyPlainObject,
>(
  initialState: State,
  ...listeners: StorePlugin<State>[]
) => {
  let store = storeYobta(initialState, ...listeners)

  return {
    ...store,
    assign(patch) {
      store.next({ ...store.last(), ...patch })
    },
    omit(...keys) {
      let keysSet = new Set(keys)
      let result: OptionalKey<State>[] = []
      let last = store.last()
      let next = { ...last }
      for (let key in last) {
        // @ts-ignore
        if (keysSet.has(key)) {
          delete next[key]
          result.push(key as unknown as OptionalKey<State>)
        }
      }
      store.next(next)
      return result
    },
  }
}
