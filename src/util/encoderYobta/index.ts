export interface YobtaEncoder {
  encode(item: any): string
  decode: <Result>(item: any) => Result
}

export const encoderYobta: YobtaEncoder = {
  encode(item) {
    return JSON.stringify(item)
  },
  decode(item) {
    return JSON.parse(item)
  },
}
