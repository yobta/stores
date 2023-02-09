import { YobtaStore, YOBTA_BEFORE } from '../../stores/createStore/index.js'

type AnyStore<State> = Pick<YobtaStore<State>, 'on' | 'last'>

interface YobtaTransitionEffect {
  <State>(
    store: AnyStore<State>,
    state: State,
    effect: (nextState: State) => VoidFunction,
  ): VoidFunction
}

export const transitionEffect: YobtaTransitionEffect = (store, state, effect) =>
  store.on(YOBTA_BEFORE, nextState => {
    if (nextState === state && nextState !== store.last()) effect(nextState)
  })
