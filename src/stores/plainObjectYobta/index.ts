import { ObservableStore, observableYobta, StorePlugin } from '../../index.js'

// #region Types
type AnyPlainObject = Record<string | number | symbol, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
type OptionalKey<T extends AnyPlainObject> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
  }[keyof T],
  undefined
>

interface PlainObjectStore<State extends AnyPlainObject>
  extends ObservableStore<State> {
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
  let store = observableYobta(initialState, ...listeners)

  return {
    ...store,
    assign(patch) {
      store.next(last => ({ ...last, ...patch }))
    },
    omit(...keys) {
      let keysSet = new Set(keys)
      let result: OptionalKey<State>[] = []
      store.next(last => {
        let next = { ...last }
        for (let key in last) {
          // @ts-ignore
          if (keysSet.has(key)) {
            delete next[key]
            result.push(key as unknown as OptionalKey<State>)
          }
        }
        return next
      })
      return result
    },
  }
}
