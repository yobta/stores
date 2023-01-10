&larr; [Home](../../../README.md)

# Set Codec

A utility for encoding and decoding [sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of values. These values can be strings, numbers, booleans, null, objects, or arrays. Objects and arrays can contain other values of these types, but the set as a whole can only contain simple values that can be serialized to a JSON string. We implemented the utility as an object with two functions: `encode` serializes a set of simple values to a JSON string, and `decode` deserializes a JSON string back into a set of simple values.

## Basic Usage

Here are a few examples of how to use the Set Codec:

```ts
import { setCodecYobta } from '@yobta/stores'

const numbers = new Set([1, 2])
const fallback = () => numbers
const encodedNumbers = setCodecYobta.encode(numbers)
const [decodedNumbers] = setCodecYobta.decode(encodedNumbers, fallback)
```

## Overloads

You can also pass in additional arguments to the `encode` function, which will be encoded along with the set. These arguments can be of any type and can be accessed when decoding the string. For example:

```ts
const strings = new Set(['one', 'two'])
const overloads = [1, 2, 3]
const fallback = () => strings
const encodedStrings = setCodecYobta.encode(strings, ...overloads)
const [decodedNumbers, ...decodedOverloads] = setCodecYobta.decode(
  encodedStrings,
  fallback,
)
```

## Decoding and Fallbacks

The `decode` method requires a fallback function. This function returns a default value if the `decode` method fails to decode the given JSON string. The `decode` method uses this fallback function to continue processing even if it fails to decode the string.
