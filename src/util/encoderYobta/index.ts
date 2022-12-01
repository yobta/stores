export interface YobtaEncoder {
  encode(item: any, ...overloads: any[]): string
  decode: (item: any, fallback: () => any) => [any, ...any[]]
}

export const encoderYobta: YobtaEncoder = {
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
