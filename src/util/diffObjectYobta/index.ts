type Key = string | number | symbol
interface YobtaDiffObject {
  <Input extends Record<Key, unknown>, Reference extends Record<Key, unknown>>(
    inputObject: Input,
    referenceObject: Reference,
  ): Partial<Input>
}

/**
 * Compares two plain objects and returns the difference object.
 *
 * @example
 * const diff = diffObjectYobta(inputObject, referenceObject)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/diffObjectYobta/index.md}
 */
export const diffObjectYobta: YobtaDiffObject = (
  inputObject,
  referenceObject,
) => {
  let diff: Partial<typeof inputObject> = {}
  for (let key in inputObject) {
    if (inputObject[key] !== referenceObject[key as Key]) {
      diff[key] = inputObject[key]
    }
  }
  return diff
}
