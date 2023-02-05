import {
  YobtaStore,
  YOBTA_IDLE,
  YOBTA_READY,
} from '../../stores/createStore/index.js'

type AnyStore<State> = Pick<YobtaStore<State>, 'on'>

interface YobtaStoreEffect {
  <State>(
    store: AnyStore<State>,
    effect: (state: State) => VoidFunction,
  ): VoidFunction
}

export const storeEffect: YobtaStoreEffect = (store, effect) => {
  let offIdle: VoidFunction | undefined
  let offReady = store.on(YOBTA_READY, state => {
    offIdle = store.on(YOBTA_IDLE, effect(state))
  })
  return () => {
    offReady()
    if (offIdle) offIdle()
  }
}
