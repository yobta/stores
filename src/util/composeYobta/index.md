&larr; [Home](../../../README.md)

# Compose Utility

A utility function that allows you to combine multiple functions into a single function. It is useful for creating complex functionality by building it up from smaller, simpler functions.

## Importing

To use `composeYobta`, you will need to import it into your project. You can do this by adding the following line at the top of your file:

```ts
import { composeYobta } from '@yobta/stores'
```

## Composing Unary Functions

Unary functions are functions that take a single argument. You can use `composeYobta` to create a new function by combining multiple unary functions together.

For example, consider the following unary functions:

```ts
const double = (x: number) => x * 2
const addOne = (x: number) => x + 1
```

We can use `composeYobta` to create a new function that first doubles a number, then adds one to it:

```ts
const doubleAndAddOne = composeYobta(addOne, double) // works from right to left
const result = doubleAndAddOne(5)
console.log(result) // 11
```

When we call `doubleAndAddOne` with an input of `5`, it will first pass `5` through the `double` function, resulting in `10`. It will then pass the result (`10`) through the `addOne` function, resulting in a final output of `11`.

**Note**: The composed functions execute in reverse order.

## Overloads

The `composeYobta` function creates a result that can accept any number of overloads. When you call this resulting function, it will pass the overloads to all of the composed functions. You can use overloads to share context between the composed functions.

Here is an example of using overloads with `composeYobta`:

```ts
const operations: string[] = []
const add = (x: number, o: string[]) => {
  o.push('add 1')
  return x + 1
}
const multiply = (x: number, o: string[]) => {
  o.push('multiply by 2')
  return x * 2
}
const addThenMultiply = composeYobta(multiply, add)
const result = addThenMultiply(2, operations)
console.log(result) // 6
console.log(operations) // ['add 1', 'multiply by 2']
```

In this example, we create the `addThenMultiply` function by composing the `add` and `multiply` functions. When we call the resulting function with two arguments, it will pass them to `add` and `multiply` in turn. The value of result will be `6` and the value of operations will be `['add 1', 'multiply by 2']` after calling `addThenMultiply`.
