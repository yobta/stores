import { YobtaGenericCodec, YobtaJsonValue } from '../jsonCodec/index.js'

type YobtaJsonMap = Map<YobtaJsonValue, YobtaJsonValue>
export interface YobtaMapCodec extends YobtaGenericCodec<YobtaJsonMap> {
  encode(item: YobtaJsonMap, ...overloads: YobtaJsonValue[]): string
  decode: <Result extends YobtaJsonMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...YobtaJsonValue[]]
}

/**
 * Encodes and decodes Map objects to JSON.
 *
 * @example
 * const encoded = mapCodec.encode(new Map(), [...overloads])
 * const [decoded, ...overloads] = mapCodec.decode(encoded, fallback)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/mapCodec/index.md}
 */
export const mapCodec: YobtaMapCodec = {
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
