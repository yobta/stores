interface YobtaDiffMap {
  <K, V>(inputMap: Map<K, V>, referenceMap: Map<K, V>): Map<K, V>
}

/**
 * Returns a new Map containing the key-value pairs in `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`.
 *
 * @param {Map<K, V>} inputMap - The first Map to compare.
 * @param {Map<K, V>} referenceMap - The second Map to compare.
 * @returns {Map<K, V>} A new Map containing the key-value pairs in `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`.
 */
export const diffMapYobta: YobtaDiffMap = (inputMap, referenceMap) => {
  let diff = new Map()
  for (let [key, value] of inputMap) {
    if (referenceMap.get(key) !== value) diff.set(key, value)
  }
  return diff
}
