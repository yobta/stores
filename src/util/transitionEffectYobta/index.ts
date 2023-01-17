import { YobtaStore, YOBTA_BEFORE } from '../../stores/storeYobta/index.js'

type AnyStore<State> = Pick<YobtaStore<State>, 'on' | 'last'>

interface TransitionEffectYobta {
  <State>(
    store: AnyStore<State>,
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
