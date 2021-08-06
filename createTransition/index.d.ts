import { createStore, StoreState } from '../createStore/index.js'

export type TransitionHandler<S, A> = (state: S, action: A) => S
export type Transition<S, A> = (action?: A) => S

export function createTransition<S extends createStore = StoreState<S>, A>(
  store: S,
  transitionHandler: TransitionHandler<StoreState<S>, A>
): Transition<StoreState<S>, A>
