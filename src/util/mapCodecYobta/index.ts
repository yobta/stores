import { YobtaAnyMap } from '../../stores/mapYobta/index.js'
import { YobtaCodec } from '../codecYobta/index.js'

export interface YobtaMapCodec extends YobtaCodec {
  encode(item: YobtaAnyMap, ...overloads: any[]): string
  decode: <Result extends YobtaAnyMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...any[]]
}

export const mapCodecYobta: YobtaMapCodec = {
  encode(item, ...overloads) {
    let entries = item.size ? [...item.entries()] : []
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends YobtaAnyMap>(item: string, fallback: () => Result) {
    try {
      let [entries, ...overloads] = JSON.parse(item)
      return [new Map(entries) as Result, ...overloads]
    } catch (_) {
      return [fallback()]
    }
  },
}
