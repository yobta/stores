interface IsEmptyArray {
  (a: any[]): boolean
}

export const isEmptyArray: IsEmptyArray = a => a.length === 0
