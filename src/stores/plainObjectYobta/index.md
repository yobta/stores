# Plain Object Store

Creates an observable store that holds an immutable value. The store creates a new value instance each time you update the value using the `assign` or `omit` operation.

## Importing and Initializing

The store factory function requires that you supply a value to be used as the initial state of the store.

```ts
import { plainObjectYobta } from '@yobta/stores'

const store = plainObjectYobta({ name: 'John', age: 30 })
```

## Assigning New Values

The `assign` method of the store allows you to modify one or more keys of the store value in an immutable manner, resulting in a new value for the store. When the transition is complete, it returns an object containing the changed keys. If there were no changes to the store and no updates were made, you will receive an empty object.

```ts
const updatedState = store.assign({ name: 'Jane', age: 35 })
```

## Omitting Keys

The `omit` method allows you to remove one or more keys from the store value without mutating the store value. As a result, you will receive an array of the removed keys. If no keys were removed and the store was not updated, you will receive an empty array.

```ts
const removedKeys = store.omit(['name'])
```

## Retrieving the Store Value

The `last` method returns a read-only value that represents the current state of the store object.

```ts
const currentState = store.last()
```

## Observing Changes

The `observe` method allows you to receive updates to the store value by providing an observer callback function. It returns a void function that you can call to remove your observer from the store.

```ts
const stopObserving = store.observe((state, changes) => {
  console.log(state, changes)
})

// Later, when you need to:
stopObserving()
```

The observer function can determine whether the change was an `assign` or `omit` operation by checking the type of the `changes` argument. If `changes` is an object, it was an `assign` operation. If `changes` is an array, it was an `omit` operation.

```ts
store.observe((state, changes) => {
  if (Array.isArray(changes)) {
    console.log('Update caused by omit operation')
  } else {
    console.log('Update caused by assign operation')
  }
})
```

## Handling Overloads

In addition to the state and changes arguments, the `observe` function's callback and the `assign` and `omit` functions also accept additional arguments in the form of an `overloads` array. These overloads can be used to pass additional data or context to the callback or functions.

For example, you might want to pass a specific message or identifier along with the state update to help the observer function or functions understand the context of the update:

```ts
store.assign({ name: 'Jane' }, 'User name changed')
store.omit(['name'], 'User name removed')

store.observe((state, changes, message) => {
  console.log(message) // Outputs: 'User name changed' or 'User name removed'
})
```

You can also pass multiple overloads, which will be passed to the callback or functions in the order they were specified:

```ts
store.assign({ name: 'Jane' }, 'User name changed', Date.now())
store.omit(['name'], 'User name removed', Date.now())

store.observe((state, changes, message, timestamp) => {
  console.log(message, timestamp) // Outputs: 'User name changed' 1623478213441 or 'User name removed' 1623478213441
})
```

You can use the overloads to pass any type of data that is relevant to your application. Just make sure to document the expected types and usage of the overloads in your code, so that other developers using the store know how to properly use them.

## Typescript

To make certain properties optional or read-only, you may need to explicitly specify their types. In the example below, we use TypeScript to make the `key` property required and read-only by preventing it from being omitted or modified. The `optionalKey` property is also specified, but it is marked as optional so it can be omitted.

```ts
type State = {
  readonly key: string
  optionalKey?: string
}
const store = plainObjectYobta<State>({
  key: 'can not be changed or removed',
  optionalKey: 'can be removed',
})
store.omit(['optionalKey'])
store.assign({ optionalKey: 'can be removed again' })
```

## Plugins

You can enhance the functionality of the plain object store by using plugins in the same way as with other stores. For more information, please refer to the [plugins documentation page](../../plugins/index.md).

## Subscribing to Store Events

The Machine store supports the same events as other stores. For more information, see the [Store documentation](../storeYobta/index.md).
