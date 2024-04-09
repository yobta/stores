import {
  YobtaIdleEvent,
  YobtaReadyEvent,
  YobtaStateGetter,
  YobtaTransitionEvent,
} from '../../stores/createStore/index.js'
import { YobtaObserver } from '../createObservable/index.js'

export type YobtaReadable<State, Overloads extends any[] = any[]> = {
  last: YobtaStateGetter<State>
  observe(observer: YobtaObserver<State, Overloads>): VoidFunction
  on(
    topic: YobtaReadyEvent | YobtaIdleEvent | YobtaTransitionEvent,
    subscriber: (state: Readonly<State>) => void,
  ): VoidFunction
}

interface ReadableUtility {
  <State, Overloads extends any[] = any[]>(
    store: YobtaReadable<State, Overloads>,
  ): YobtaReadable<State, Overloads>
}

export const readable: ReadableUtility = ({ last, observe, on }) => ({
  last,
  observe,
  on,
})
