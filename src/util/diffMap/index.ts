interface YobtaDiffMap {
  <K, V>(inputMap: Map<K, V>, referenceMap: Map<K, V>): Map<K, V>
}

/**
 * Compares two Map objects and returns the difference Map object.
 *
 * @example
 * const diffMap = diffMap(inputMap, referenceMap)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/diffMap/index.md}
 */
export const diffMap: YobtaDiffMap = (inputMap, referenceMap) => {
  const diff = new Map()
  for (const [key, value] of inputMap) {
    if (referenceMap.get(key) !== value) diff.set(key, value)
  }
  return diff
}
