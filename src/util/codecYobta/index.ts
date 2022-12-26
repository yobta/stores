export interface YobtaCodec {
  encode(item: any, ...overloads: any[]): string
  decode: (item: any, fallback: () => any) => [any, ...any[]]
}

/**
 * Object that provides encoding and decoding functionality.
 *
 * @namespace codecYobta
 *
 * @property {function} encode - Encode an item and any additional overloads as a JSON string.
 * @param {any} item - The item to be encoded.
 * @param {...any} overloads - Additional overloads to include in the encoded string.
 * @returns {string} - The encoded string.
 *
 * @property {function} decode - Decode an item from a JSON string, falling back to a provided fallback value if necessary.
 * @param {any} item - The item to be decoded.
 * @param {function} fallback - A function that returns the fallback value to use if the item cannot be decoded.
 * @returns {[any, ...any[]]} - An array containing the decoded item, followed by any additional overloads.
 */
export const codecYobta: YobtaCodec = {
  encode(item, ...overloads) {
    return JSON.stringify([item, ...overloads])
  },
  decode(item, fallback) {
    try {
      return JSON.parse(item || '')
    } catch (_) {
      return [fallback()]
    }
  },
}
