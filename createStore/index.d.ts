export type Unsubscribe = () => void

export type Observer<S> = (state: S, ...args: any[]) => void

export type ObservableStore<S> = {
  last(): S
  next(nextState: S, ...args: any[]): void
  observe(observer: Observer<S>): Unsubscribe
  reset(): void
}

export type StoreState<S extends createStore> = ReturnType<S['last']>

export function createStore<S>(initialState: S): ObservableStore<S>
