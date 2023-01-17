import { YobtaStore, YOBTA_BEFORE } from '../../stores/storeYobta/index.js'

type AnyStore<State> = Pick<YobtaStore<State>, 'on' | 'last'>

interface TransitionEffectYobta {
  <Store extends AnyStore<State>, State>(
    store: Store,
    state: State,
    effect: (nextState: State) => VoidFunction,
  ): VoidFunction
}

export const transitionEffectYobta: TransitionEffectYobta = (
  store,
  state,
  effect,
) =>
  store.on(YOBTA_BEFORE, nextState => {
    if (nextState === state && nextState !== store.last()) effect(nextState)
  })
