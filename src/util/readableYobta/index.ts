import {
  YobtaIdleEvent,
  YobtaReadyEvent,
  YobtaStateGetter,
  YobtaTransitionEvent,
} from '../../stores/createStore/index.js'

export type YobtaReadable<State, Overloads extends any[] = any[]> = {
  last: YobtaStateGetter<State>
  observe(
    observer: (state: Readonly<State>, ...overloads: Overloads) => void,
  ): VoidFunction
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

export const readableYobta: ReadableUtility = ({ last, observe, on }) => ({
  last,
  observe,
  on,
})
