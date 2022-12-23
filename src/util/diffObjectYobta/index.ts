type Key = string | number | symbol
interface YobtaDiffObject {
  <Input extends Record<Key, unknown>, Reference extends Record<Key, unknown>>(
    inputObject: Input,
    referenceObject: Reference,
  ): Partial<Input>
}

/**
 * Returns a new object containing the key-value pairs in `inputObject` that are not present in `referenceObject`, or have different values in `referenceObject`.
 *
 * @param {Map<K, V>} inputObject - The first object to compare.
 * @param {Map<K, V>} referenceObject - The second object to compare.
 * @returns {Map<K, V>} A new object containing the key-value pairs in `inputObject` that are not present in `referenceObject`, or have different values in `referenceObject`.
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
