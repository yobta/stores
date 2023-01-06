export type YobtaJsonValue =
  | string
  | number
  | boolean
  | null
  | { [property: string | number]: YobtaJsonValue }
  | YobtaJsonValue[]

export interface YobtaAnyCodec {
  encode(item: any, ...overloads: any[]): string
  decode: (item: any, fallback: () => any) => [any, ...any[]]
}

interface YobtaSimpleCodec extends YobtaAnyCodec {
  encode(item: YobtaJsonValue, ...overloads: YobtaJsonValue[]): string
  decode: (
    item: any,
    fallback: () => any,
  ) => [YobtaJsonValue, ...YobtaJsonValue[]]
}

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
