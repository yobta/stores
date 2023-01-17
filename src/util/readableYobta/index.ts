import { YobtaStore } from '../../stores/storeYobta/index.js'

export type YobtaReadable<State> = Pick<YobtaStore<State>, 'last' | 'observe'>

interface ReadableUtility {
  <State>(store: YobtaReadable<State>): YobtaReadable<State>
}

export const readableYobta: ReadableUtility = ({ last, observe }) => ({
  last,
  observe,
})
