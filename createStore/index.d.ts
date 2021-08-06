export type Unsubscribe = () => void

export type Observer<S> = (state: S) => void

export type ObservableStore<S> = {
  add(observer: Observer<S>): Unsubscribe
  getState(): S
  setState(nextState: S): void
  reset(): void
}

export type StoreState<S extends createStore> = ReturnType<S['getState']>

export function createStore<S>(initialState: S): ObservableStore<S>
