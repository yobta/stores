export function encodeYobta(item: any): string {
  return JSON.stringify(item)
}

export function decodeYobta(item: string | null): unknown {
  if (item === null) {
    return null
  }
  return JSON.parse(item)
}
