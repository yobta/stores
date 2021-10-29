export function encode(item: any): string {
  return JSON.stringify(item)
}

export function decode(item: string | null): unknown {
  if (item === null) {
    return null
  }
  return JSON.parse(item)
}
