import {
  YobtaStore,
  YOBTA_IDLE,
  YOBTA_READY,
} from '../../stores/storeYobta/index.js'

type AnyStore<State> = Pick<YobtaStore<State>, 'on'>

interface StoreEffectYobta {
  <Store extends AnyStore<State>, State>(
    store: Store,
    effect: (state: Parameters<Parameters<Store['on']>[1]>[0]) => VoidFunction,
  ): VoidFunction
}

export const storeEffectYobta: StoreEffectYobta = (store, effect) => {
  let offIdle: VoidFunction | undefined
  let offReady = store.on(YOBTA_READY, state => {
    offIdle = store.on(YOBTA_IDLE, effect(state))
  })
  return () => {
    offReady()
    if (offIdle) offIdle()
  }
}
