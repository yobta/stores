import { ObservableStore, StoreState } from '../createStore/index.js'

export type Transition<S, A> = (state: S, ...args: A) => S
export type TransitionTrigger<S, A> = (...args: A) => S

export function createTransition<S extends ObservableStore, A>(
  store: S,
  transition: Transition<StoreState<S>, A>
): TransitionTrigger<StoreState<S>, A>
