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

The `observe` method of `observableYobta` allows you to subscribe to updates on the observable object. The `observer` argument is a callback that will be called each time next is called on the observable. The `callbacks` argument is an optional array of additional callbacks that will be called after the `observer` callback has been called.

The `observe` method returns a function that can be called to unsubscribe from updates.

Internally, the `observableYobta` object uses a set `heap` to keep track of the `observer` and `callbacks` arguments passed to the `observe` method. The `next` method iterates over `heap` to call all registered observers and callbacks in the order they were added. It executes all the observers followed by all the callbacks. The `next` method also uses sets to de-duplicate observers and callbacks to ensure that each callback is only called once.

The `observableYobta` is used internally by [derived](../../stores/derivedYobta/index.md) stores to solve the [multiple inheritance](https://en.wikipedia.org/wiki/Multiple_inheritance) problem.
