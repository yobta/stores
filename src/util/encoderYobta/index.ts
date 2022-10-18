export interface YobtaEncoder {
  encode(item: any): string
  decode: <Result>(item: any) => Result
}

export const encoderYobta: YobtaEncoder = {
  encode(item) {
    return JSON.stringify(item)
  },
  decode(item) {
    try {
      return JSON.parse(item)
    } catch (error) {
      return error
    }
  },
}
