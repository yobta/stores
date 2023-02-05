&larr; [Home](../../../README.md)

# Object Diff Utility

The `diffObject` utility is a function that compares two objects and returns a new object containing only the key-value pairs that are different between the two objects. If there are no differences, returns `null`.

## How to use

`diffObject` can be imported and used as follows:

```ts
import { diffObject } from '@yobta/stores'

let inputObject = {
  key1: 'value1',
  key2: 'value2',
}
let referenceObject = {
  key1: 'value1',
  key2: 'differentValue2',
}
let diffObject = diffObject(inputObject, referenceObject)
console.log(diffObject) // { key2: 'value2' }
```

## Output

`diffObject` returns a partial of the `inputObject` containing only the key-value pairs that differ from the corresponding key-value pairs in the `referenceObject`. If there are no differences between the two objects, `diffObject` returns an empty object `{}`.

For example:

```ts
let inputObject = {
  key1: 'value1',
  key2: 'value2',
}
let referenceObject = {
  key1: 'value1',
  key2: 'value2',
}
let diffObject = diffObject(inputObject, referenceObject)
console.log(diffObject) // {}
```
