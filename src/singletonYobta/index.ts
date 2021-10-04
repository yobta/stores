export type Terminator = () => void

export type Observer<S> = (state: S, ...args: any[]) => void

export type Action<S> = S | ((last: S) => S)

export interface ObservableStore<S> {
  last(): Readonly<S>
  next(action: Action<S>, ...args: any[]): void
  observe(observer: Observer<S>): Terminator
  size(): number
}

interface SingletonFactory {
  <S>(initialState: S): ObservableStore<S>
}

export const singletonYobta: SingletonFactory = initialState => {
  let observers: Observer<any>[] = []
  let state = initialState

  return {
    last: () => state,
    next: (action, ...args) => {
      state =
        typeof action === 'function'
          ? // @ts-ignore
            action(state)
          : action
      observers.forEach(observe => {
        observe(state, ...args)
      })
    },
    observe: observer => {
      observers.push(observer)
      return () => {
        let index = observers.indexOf(observer)
        observers.splice(index, 1)
      }
    },
    size: () => observers.length,
  }
}
