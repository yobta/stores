import { ObservableStore, observableYobta, StorePlugin } from '../../index.js'

// #region Types
type AnyMap = Record<string, any>
// TODO: https://github.com/microsoft/TypeScript/issues/35103
// type OptionalKey<S extends AnyMap> = keyof? S
type OptionalKey<T extends AnyMap> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
  }[keyof T],
  undefined
>

interface MapStore<S extends AnyMap> extends ObservableStore<S> {
  assign(patch: Partial<S>): void
  omit(...keys: OptionalKey<S>[]): OptionalKey<S>[]
}

interface MapFactory {
  <State extends AnyMap>(
    initialState: State,
    ...listeners: StorePlugin<State>[]
  ): MapStore<State>
}
// #endregion

export const mapYobta: MapFactory = <State extends AnyMap>(
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
