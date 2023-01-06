import { YobtaCodec } from '../codecYobta/index.js'
import { YobtaJsonValue } from '../setCodecYobta/index.js'

export interface YobtaMapCodec extends YobtaCodec {
  encode(
    item: Map<YobtaJsonValue, YobtaJsonValue>,
    ...overloads: YobtaJsonValue[]
  ): string
  decode: <Result extends Map<YobtaJsonValue, YobtaJsonValue>>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...YobtaJsonValue[]]
}

export const mapCodecYobta: YobtaMapCodec = {
  encode(item, ...overloads) {
    let entries = item.size ? [...item.entries()] : []
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends Map<YobtaJsonValue, YobtaJsonValue>>(
    item: string,
    fallback: () => Result,
  ) {
    try {
      let [entries, ...overloads] = JSON.parse(item)
      return [new Map(entries) as Result, ...overloads]
    } catch (_) {
      return [fallback()]
    }
  },
}
