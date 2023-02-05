&larr; [Home](../../../README.md)

# Map Codec

A utility for encoding and decoding [maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of values. A map is a collection of key-value pairs, where both the keys and values are of the same type. The type can be any of the following: string, number, boolean, null, an object with string or number keys and values of the same type, or an array of values of the same type. The Map Codec can be used to serialize a map of simple values to a JSON string and deserialize it back into a map.

## Introduction

The `mapCodec` object has two functions:

- `encode`: Encodes a map and any additional arguments as a string.
- `decode`: Decodes a map from a string, falling back to a provided fallback function if necessary.

## Encoding an Item

To encode a map, you can call the `encode` function on the `mapCodec` object, passing in the map as the first argument. For example:

```ts
const encodedMap = mapCodec.encode(
  new Map([
    [1, 'a'],
    [2, 'b'],
  ]),
)
```

This will return a string that represents the map.

## Encoding Item with Overloads

You can also pass in additional arguments to the `encode` function, which will be encoded along with the map. These arguments can be of any type and can be accessed when decoding the string. For example:

```ts
const encodedMap = mapCodec.encode(
  new Map([
    [1, 'a'],
    [2, 'b'],
  ]),
  'some additional value',
  123,
)
```

The encodedMap variable will contain the following string:

```ts
'[[[1,"a"],[2,"b"]],"some additional value",123]'
```

This string can be decoded back into the original map and additional values using the `decode` function.

## Decoding and Fallback

To decode a string that was encoded with the `encode` function, you can call the `decode` function on the `mapCodec` object, passing in the string as the first argument and a fallback function as the second argument. The fallback function should return a default map to be used in case the decoding fails. For example:

```ts
const [decodedMap, otherValues] = mapCodec.decode(encodedMap, () => new Map())
```

This will return an array that contains the decoded map and any additional values that were encoded with the map. If the decoding fails, the fallback function will be called and the returned map will be used instead.

## Example

Here is an example of how to use the `mapCodec` object:

```ts
import { mapCodec } from '@yobta/stores'

const map = new Map([
  [1, 'a'],
  [2, 'b'],
])
const encodedMap = mapCodec.encode(map, 'some additional value', 123)
const [decodedMap, otherValues] = mapCodec.decode(encodedMap, () => new Map())

console.log(decodedMap) // Map { 1 => 'a', 2 => 'b' }
console.log(otherValues) // ['some additional value', 123]
```
