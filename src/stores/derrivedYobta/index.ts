import { YobtaReadable } from '../../util/readableYobta/index.js'
import {
  storeYobta,
  YobtaIdleEvent,
  YobtaReadyEvent,
  YobtaTransitionEvent,
} from '../storeYobta/index.js'

type AnyStore<State = any> = {
  last(): State
  observe(
    observer: (state: State) => void,
    ...callbacks: VoidFunction[]
  ): VoidFunction
}
type YobtaState<SomeStore> = SomeStore extends {
  last(): infer Value
}
  ? Value
  : any
type States<Stores extends AnyStore[]> = {
  [Key in keyof Stores]: Stores[Key] extends YobtaReadable<infer State>
    ? State
    : YobtaState<Stores[Key]>
}
interface YobtaDerrived {
  <DerrivedState extends any, Stores extends AnyStore[]>(
    callback: (...states: States<Stores>) => DerrivedState,
    ...stores: Stores
  ): {
    last(): DerrivedState
    observe(
      observer: (state: DerrivedState) => void,
      ...callbacks: VoidFunction[]
    ): VoidFunction
    on(
      topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
      subscriber: (state: Readonly<DerrivedState>) => void,
    ): VoidFunction
  }
}

export const derrivedYobta: YobtaDerrived = (acc, ...stores) => {
  let getState = (): any =>
    acc(...(stores.map(({ last }) => last()) as States<typeof stores>))
  let state = getState()
  let { last, on, next, observe } = storeYobta(state)
  let debounce = (): void => {
    state = getState()
  }
  let update = (): void => {
    next(state)
  }
  return {
    last,
    observe(observer, ...callbacks) {
      let unsubcribe = [
        ...stores.map(store => store.observe(debounce, update, ...callbacks)),
        observe(observer),
      ]
      return () => {
        unsubcribe.forEach(u => {
          u()
        })
      }
    },
    on,
  }
}
