&larr; [Home](../../../README.md)

# Codec Utility

Provides encoding and decoding functionality using the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) methods. It is a simple codec that can be used for encoding and decoding basic [JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures) such as [numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type), [strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), and [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Object_type), but may not be suitable for encoding and decoding more complex data types such as [sets](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or [maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

## Introduction

The `jsonCodec` object has two methods:

- `encode`: Encodes an item and any additional overloads as a JSON string.
- `decode`: Decodes an item from a JSON string, falling back to a provided fallback value if necessary.

## Encoding an Item

To encode an item, pass it as the first argument to the `encode` method:

```ts
const item = { a: 'b' }
const encoded = jsonCodec.encode(item)
```

## Encoding Item with Overloads

To encode an item with additional overloads, pass them as additional arguments to the `encode` method:

```ts
const item = { a: 'b' }
const overload1 = { c: 'd' }
const overload2 = { e: 'f' }
const encoded = jsonCodec.encode(item, overload1, overload2)
```

## Decoding and Fallback

To decode an item, pass it as the first argument to the `decode` method and a fallback function as the second argument:

```ts
const item = '{"a":"b"}'
const fallback = () => 'yobta'
const decoded = jsonCodec.decode(item, fallback)
```

If the item cannot be decoded, the fallback function will be called and its return value will be used.

If the item can be decoded, the `decode` method returns an array containing the decoded item, followed by any additional overloads that were included in the encoded string.

For example, if the encoded string is `'["a","b","c"]'`, the decode method will return an array `['a', 'b', 'c']`.

Note that because the `encode` method always creates an array of the item and the overloads, you should expect the returned value of the `decode` method to be an array when decoding a previously encoded item.
