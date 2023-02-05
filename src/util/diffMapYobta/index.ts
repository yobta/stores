interface YobtaDiffMap {
  <K, V>(inputMap: Map<K, V>, referenceMap: Map<K, V>): Map<K, V>
}

/**
 * Compares two Map objects and returns the difference Map object.
 *
 * @example
 * const diffMap = diffcreateMapStore(inputMap, referenceMap)
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/diffcreateMapStore/index.md}
 */
export const diffcreateMapStore: YobtaDiffMap = (inputMap, referenceMap) => {
  let diff = new Map()
  for (let [key, value] of inputMap) {
    if (referenceMap.get(key) !== value) diff.set(key, value)
  }
  return diff
}
