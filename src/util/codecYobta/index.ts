export type YobtaJsonValue =
  | string
  | number
  | boolean
  | null
  | { [property: string | number]: YobtaJsonValue }
  | YobtaJsonValue[]

export interface YobtaGenericCodec<Value> {
  encode(item: Value, ...overloads: YobtaJsonValue[]): string
  decode: (item: any, fallback: () => any) => [any, ...any[]]
}

export interface YobtaSimpleCodec extends YobtaGenericCodec<YobtaJsonValue> {
  encode(item: YobtaJsonValue, ...overloads: YobtaJsonValue[]): string
  decode: (
    item: any,
    fallback: () => any,
  ) => [YobtaJsonValue, ...YobtaJsonValue[]]
}

/**
 * Encodes and decodes simple js datatypes to JSON.
 *
 * @example
 * const encoded = codecYobta.encode(123, [...overloads])
 * const [decoded, ...overloads] = codecYobta.decode(encoded, fallback)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/codecYobta/index.md}
 */
export const codecYobta: YobtaSimpleCodec = {
  encode(item, ...overloads) {
    return JSON.stringify([item, ...overloads])
  },
  decode(item, fallback) {
    try {
      return JSON.parse(item || '')
    } catch (_) {
      return [fallback()]
    }
  },
}
