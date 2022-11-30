import { AnyMap } from '../../stores/mapYobta/index.js'
import { YobtaEncoder } from '../encoderYobta/index.js'

export interface YobtaMapEncoder extends YobtaEncoder {
  encode(item: AnyMap, ...overloads: any[]): string
  decode: <Result extends AnyMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...any[]]
}

export const mapEncoderYobta: YobtaMapEncoder = {
  encode(item, ...overloads) {
    let entries = Array.from(item.entries())
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends AnyMap>(item: string, fallback: () => Result) {
    try {
      let [entries, ...overloads] = JSON.parse(item)
      return [new Map(entries) as Result, ...overloads]
    } catch (e) {
      return [fallback()]
    }
  },
}
