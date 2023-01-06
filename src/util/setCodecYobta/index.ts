import { YobtaCodec } from '../codecYobta/index.js'

export type YobtaJsonValue =
  | string
  | number
  | boolean
  | null
  | { [property: string | number]: YobtaJsonValue }
  | YobtaJsonValue[]

export interface YobtaSetCodec extends YobtaCodec {
  encode(item: Set<YobtaJsonValue>, ...overloads: YobtaJsonValue[]): string
  decode: <Result extends Set<YobtaJsonValue>>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...YobtaJsonValue[]]
}

export const setCodecYobta: YobtaSetCodec = {
  encode(item, ...overloads) {
    let entries = item.size ? [...item] : []
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends Set<any>>(item: string, fallback: () => Result) {
    try {
      let [entries, ...overloads] = JSON.parse(item)
      return [new Set(entries) as Result, ...overloads]
    } catch (_) {
      return [fallback()]
    }
  },
}
