&larr; [Home](../../../README.md)

# Observable Utility

Creates an observable object that allows you to observe changes to its value and any optional overloads.

## Usage

```ts
import { observableYobta } from '@yobta/stores'

const observable = observableYobta() // creates a new observable object
```

## Observing Changes

You can observe changes to the value and overloads of an observable object by passing a callback function to the `observe` method. The callback function will be called whenever the `next` method is called on the observable object, and it will be passed the current value and overloads as arguments.

```ts
const observer = (value: any, ...overloads: any[]) => {
  console.log(value, overloads)
}
const stopObserving = observable.observe(observer) // returns a function to stop observing

observable.next('any value', ...['optional', 'overloads']) // logs "any value", ["optional", "overloads"]
```

## Getting Observers Count

You can check how many observers are currently listening to an observable object by accessing its `size` property.

```ts
console.log(observable.size)
```

## TypeScript

By default, the value and overloads types can be of any type, but you can restrict them to specific types using TypeScript's generic type notation.

```ts
const observable = observableYobta<number>() // the value type is restricted to number

observable.next(1) // OK
observable.next('string') // Not OK
```

You can also specify the types for overloads

```ts
const observable = observableYobta<number, string[]>() // The value type is number and overloads type is array of strings

observable.next(1, ['overload1', 'overload2']) // OK
observable.next(1, 2) // Not OK
```

## Callbacks

The `observe` method lets you subscribe to updates with one or more callbacks. The `next` method is used to execute these callbacks in the order they were added, removing duplicates. In case of duplicate callbacks, the last added callback is kept, and the previous ones are deduplicated. The observe method returns a function to unsubscribe.

```js
const callback = item => console.log('callback called: ', item)
const stop = observable.observe(callback, callback)

observable.next('yobta')
```

Call the function returned by `observe` to unsubscribe.
