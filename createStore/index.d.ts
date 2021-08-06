export type Unsubscribe = () => void
export type Observer<S> = (state: S) => Unsubscribe

export type ObservableStore<S> = {
  add(observer: Observer<S>)
  getState(): S
  setState(nextState: S): void
  reset(): void
}

export function createStore<S>(initialState: S): ObservableStore<S>
