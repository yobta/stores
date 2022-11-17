import { AnyMap } from '../../stores/mapYobta/index.js'

export interface YobtaMapEncoder {
  encode(item: AnyMap, ...overloads: any[]): string
  decode: <Result extends AnyMap>(item: string) => [Result, ...any[]]
}

export const mapEncoderYobta: YobtaMapEncoder = {
  encode(item, ...overloads) {
    let entries = Array.from(item.entries())
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends AnyMap>(item: string) {
    let [entries, ...overloads] = JSON.parse(item)
    return [new Map(entries) as Result, ...overloads]
  },
}
