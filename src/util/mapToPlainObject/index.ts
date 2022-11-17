interface MapToPlainObject {
  <M extends Map<string, any>>(map: M): Record<keyof M, M[keyof M]>
}

type ReturnedMap<Map> = Record<keyof Map, Map[keyof Map]>

export const mapToPlainObject: MapToPlainObject = map => {
  return Object.fromEntries(map) as ReturnedMap<typeof map>
}
