import { YobtaAnyMap } from '../../stores/mapYobta/index.js'
import { YobtaCodec } from '../codecYobta/index.js'

export interface YobtaMapCodec extends YobtaCodec {
  encode(item: YobtaAnyMap, ...overloads: any[]): string
  decode: <Result extends YobtaAnyMap>(
    item: string,
    fallback: () => Result,
  ) => [Result, ...any[]]
}

/**
 * An object that implements the YobtaMapCodec interface, providing functions for
 * encoding and decoding maps.
 *
 * @typedef {Object} YobtaMapCodec
 * @property {function} encode - Encodes a map into a string.
 * @property {function} decode - Decodes a string into a map.
 *
 * @example
 * const encodedMap = mapCodecYobta.encode(new Map([[1, 'a'], [2, 'b']]))
 * const [decodedMap, otherValues] = mapCodecYobta.decode(encodedMap, () => new Map())
 */
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
