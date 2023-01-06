import { YobtaGenericCodec, YobtaJsonValue } from '../codecYobta/index.js'

type YobtaJsonMap = Map<YobtaJsonValue, YobtaJsonValue>
export interface YobtaMapCodec extends YobtaGenericCodec<YobtaJsonMap> {
  encode(item: YobtaJsonMap, ...overloads: YobtaJsonValue[]): string
  decode: <Result extends YobtaJsonMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...YobtaJsonValue[]]
}

export const mapCodecYobta: YobtaMapCodec = {
  encode(item, ...overloads) {
    let entries = item.size ? [...item.entries()] : []
    return JSON.stringify([entries, ...overloads])
  },
  decode<Result extends YobtaJsonMap>(item: string, fallback: () => Result) {
    try {
      let [entries, ...overloads] = JSON.parse(item)
      return [new Map(entries) as Result, ...overloads]
    } catch (_) {
      return [fallback()]
    }
  },
}
