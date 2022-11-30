export interface YobtaEncoder {
  encode(item: any, ...overloads: any[]): string
  decode: (item: any, fallback: () => any) => any
}

export const encoderYobta: YobtaEncoder = {
  encode(item) {
    return JSON.stringify(item)
  },
  decode(item, fallback) {
    try {
      return JSON.parse(item)
    } catch (_e) {
      return fallback()
    }
  },
}
