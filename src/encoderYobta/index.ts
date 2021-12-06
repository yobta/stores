export function encodeYobta(item: any): string {
  return JSON.stringify(item)
}

export function decodeYobta(item: any): unknown {
  try {
    return JSON.parse(item)
  } catch (error) {
    return error
  }
}
