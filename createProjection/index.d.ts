import {
  ObservableStore,
  Observer,
  Unsubscribe,
  StoreState
} from '../createStore/index.js'

type States<S extends ObservableStore[]> = {
  [Index in keyof S]: StoreState<S[Index]>
}

export type ProjectionCallback<C, S extends ObservableStore[]> = (
  ...states: States<S>
) => C

export type Projection<C, S> = {
  last(): ReturnType<ProjectionCallback<C, S>>
  observe(observer: Observer<C>): Unsubscribe
}

export function createProjection<C, S extends ObservableStore[]>(
  callback: ProjectionCallback<C, S>,
  ...stores: S
): Projection<C, S>
