interface IsFunction {
  (f: any): boolean
}

export const isFunction: IsFunction = f => typeof f === 'function'
