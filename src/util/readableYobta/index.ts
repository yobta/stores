import { YobtaStore } from '../../stores/storeYobta/index.js'

export type YobtaReadable<State, Overloads extends any[] = any[]> = Pick<
  YobtaStore<State, Overloads>,
  'last' | 'observe' | 'on'
>

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
