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
      observer: (state: DerrivedState, ...overloads: never) => void,
    ): VoidFunction
    on(
      topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
      subscriber: (state: Readonly<DerrivedState>) => void,
    ): VoidFunction
  }
}

const getStates = <Stores extends AnyStore[]>(stores: Stores): States<Stores> =>
  stores.map(store => store.last()) as States<Stores>

export const derrivedYobta: YobtaDerrived = (callback, ...stores) => {
  let getState = (): any => callback(...getStates(stores))
  let { last, on, next } = storeYobta(getState())
  let derrive = (): void => {
    next(getState())
  }
  return {
    last,
    observe(observer) {
      let notify = (): void => {
        observer(last())
      }
      let unsubcribe = [
        ...stores.map(({ observe }) => observe(derrive, notify)),
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
