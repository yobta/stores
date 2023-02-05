&larr; [Home](../../../README.md)

# Map Store

Map store factory creates an observable object that stores value as a JavaScript [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object.

## Creating a Store

When creating a Map Store, you will need to provide an initial state as a plain object:

```ts
import { createMapStore } from '@yobta/stores'

const store = createMapStore({
  foo: 'bar',
  baz: 123,
})
```

## Retrieving the State

To retrieve the current state of the store, you can use the `last` method provided by the store. This method returns the latest state object stored in the store.

Here is an example of how you can retrieve and log the current state:

```ts
const currentState = store.last()
```

## Assigning to the State

You can use the `assign` method to update one or more keys of the state. Please note that in TypeScript, you can only assign values to writable keys that belong to the state. Attempting to assign a value to a key that is not part of the state or is read-only will result in an error.

```ts
const changes = store.assign({
  foo: 'new value',
  baz: 456,
})
```

## Omitting the Keys

To remove one or multiple keys from the state, you can use the `assign` method. However, in TypeScript, you can only omit optional keys from the state. If a key is required or not part of the state, you will receive a TypeScript error.

```ts
const keysToOmit = ['foo']
const changes = store.omit(keysToOmit)
```

## Observing Store

To observe updates to the store's state, you can use the `observe` method of the store object. This method takes an observer function as an argument, which will be called whenever the store's state is updated. The observer function receives three arguments: the current state, the changes, and any additional arguments passed to the `next` method.

```ts
store.observe((state, changes) => {
  console.log('Current state:', state)
  console.log('Changes:', changes)
})
```

To determine the type of operation that caused the update, you can check the type of the `changes` object. If it is a `Map`, the update was caused by an `assign` operation. If it is a `Set`, the update was caused by an `omit` operation.

```ts
store.observe((state, changes) => {
  if (changes instanceof Map) {
    console.log('Update caused by assign operation')
  } else if (changes instanceof Set) {
    console.log('Update caused by omit operation')
  }
})
```

## Overloads

Both the `assign` and `omit` methods can accept overloads that allow you to pass additional metadata to the observers. This can be helpful when you want to send some extra information to the observers along with the state updates.

Here is an example of using the assign method with an overload:

```ts
const patch = {
  foo: 'new value',
  baz: 456,
}
const metadata = {
  type: 'ASSIGN',
}
const changes = store.assign(patch, metadata)
```

In this example, the `metadata` object will be passed to the observer functions along with the current state and the changes that were made to the store.

Here is an example of using the `omit` method with an overload:

```ts
const keysToOmit = ['foo']
const metadata = {
  type: 'OMIT',
}
const changes = store.omit(keysToOmit, metadata)
```

In this example, the `metadata` object will be passed to the observer functions along with the current state and the keys that were removed from the store.

Note that the overloads do not affect the state of the store, they are only passed to the observers.

Here is an example of an observer function that handles the metadata passed through the overloads of the `assign` and `omit` methods:

```ts
const observer = (state, changes, metadata) => {
  console.log('state:', state)
  console.log('changes:', changes)
  console.log('metadata:', metadata)
}

store.observe(observer)
```

## Extending the Store with Plugins

To extend the store with a plugin, you can pass the plugin as an argument to the `createMapStore` function when creating the store. The plugin should be an object with a `middleware` method that takes the store's `next` method as an argument and returns a new `next` method.

Here is an example of using the [Local Storage Plugin](../../plugins/localStoragePlugin/index.md) plugin, which replicates the store's state to local storage and synchronizes changes between active store instances:

```ts
const store = createMapStore(
  { key: 'value' },
  localStoragePlugin({
    channel: 'my-map-store-yobta',
    codec: mapCodec,
  }),
)
```

Note that the `codec` property of the Local Storage plugin is optional. However, when using the plugin with a `createMapStore` store, a `codec` is required to serialize the store's state to JSON. If the state has nested maps, sets, or other types that cannot be easily serialized to JSON, you may need to create your own codec.

The Map store supports plugins in the same way that other stores do. For more information, see the [Plugins documentation](../../plugins/index.md).

## Subscribing to Store Events

The Map store supports the same events as other stores. For more information, see the [Store documentation](../createStore/index.md).
