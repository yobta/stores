&larr; [Home](../../../README.md)

# Diff Map Utility

A utility that takes in two [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) objects, `inputMap` and `referenceMap`, and returns a new `Map` containing the key-value pairs in `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`.

## How to use the utility

To use the `diffMapYobta` utility, you can import it into your project like this:

```ts
import { diffMapYobta } from '@yobta/stores'
```

Then, you can call the function with two `Map` objects as arguments:

```ts
let diffMap = diffMapYobta(inputMap, referenceMap)
```

The function will return a new `Map` object containing the key-value pairs from `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`.

## Output

If there are differences between the two maps, the output will be a new `Map` object containing the key-value pairs from `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`.

For example, given the following `inputMap` and `referenceMap`:

```ts
let inputMap = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
  ['key3', 'value3'],
])
let referenceMap = new Map([
  ['key1', 'value1'],
  ['key2', 'differentValue2'],
  ['key4', 'value4'],
])
```

The output of `diffMapYobta(inputMap, referenceMap)` would be a new `Map` object with the following key-value pairs:

```ts
{
'key2': 'value2',
'key3': 'value3',
}
```

If there are no differences between the two maps, the output will be an empty `Map` object.

For example, given the following `inputMap` and `referenceMap`:

```ts
let inputMap = new Map<any, any>([
  [1, 'value1'],
  [true, 'value2'],
  ['key3', false],
])
let referenceMap = new Map<any, any>([
  [1, 'value1'],
  [true, 'differentValue2'],
  ['key3', true],
])
```

The output of `diffMapYobta(inputMap, referenceMap)` would be an empty `Map` object.

The `diffMapYobta` utility can handle maps with different types of keys and values correctly. For example, given the following `inputMap` and `referenceMap`:

```ts
let inputMap = new Map<any, any>([
  [1, 'value1'],
  [true, 'value2'],
  ['key3', false],
])
let referenceMap = new Map<any, any>([
  [1, 'value1'],
  [true, 'differentValue2'],
  ['key3', true],
])
```

The output of `diffMapYobta(inputMap, referenceMap)` would be a new `Map` object with the following key-value pairs:

```ts
{
  true: 'value2',
  'key3': false,
}
```
