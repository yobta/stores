import { YobtaAnyMap } from '../../stores/mapYobta/index.js'
import { YobtaEncoder } from '../encoderYobta/index.js'

export interface YobtaMapEncoder extends YobtaEncoder {
  encode(item: YobtaAnyMap, ...overloads: any[]): string
  decode: <Result extends YobtaAnyMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...any[]]
}

export const mapEncoderYobta: YobtaMapEncoder = {
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
