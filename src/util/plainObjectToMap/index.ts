interface PlainObjectToMap {
  <PlainObject extends Record<string, any>>(plainObject: PlainObject): Map<
    keyof PlainObject,
    PlainObject[keyof PlainObject]
  >
}

export const plainObjectToMap: PlainObjectToMap = plainObject => {
  return new Map(Object.entries(plainObject))
}
