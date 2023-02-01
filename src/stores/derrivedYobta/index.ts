import { observableYobta } from '../../util/observableYobta/index.js'
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
    callback?: VoidFunction,
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
      callback?: VoidFunction,
    ): VoidFunction
    on(
      topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
      subscriber: (state: Readonly<DerrivedState>) => void,
    ): VoidFunction
  }
}

const getStates = <Stores extends AnyStore[]>(stores: Stores): States<Stores> =>
  stores.map(store => store.last()) as States<Stores>

export const derrivedYobta: YobtaDerrived = (acc, ...stores) => {
  let getState = (): any => acc(...getStates(stores))
  let state = getState()
  let { last, on, next, observe } = storeYobta(state)
  let collect = (): void => {
    state = getState()
  }
  let derrive = (): void => {
    next(state)
  }
  return {
    last,
    observe(observer, callback) {
      let unsubcribe = [
        ...stores.map(store => store.observe(collect, callback || derrive)),
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
