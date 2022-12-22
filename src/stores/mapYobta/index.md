&larr; [Home](../../../README.md)

# Map Store

`mapYobta` is a factory function that creates a new store object that stores state as a JavaScript [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object. The type of the `Map` object will be inferred from the plain object provided as the initial state. The state of the store is immutable, and each time the `assign` or `omit` method is called, the store is given a new instance of the `Map` object.

## Parameters

- `initialState`: A plain object that will be converted to a `Map` object and used as the initial state of the store.
- `plugins`: (optional) An array of `YobtaStorePlugin` objects that modify the behavior of the store.

## Returns

A store object with the following methods:

- `assign`: Takes an object containing new values for the store and assigns them to the store. Any keys in the object that already exist in the store will be overwritten with the new values. This method will only send updates to observers if the state has changed, and returns a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object containing the changes that were made to the store.

- `observe`: Takes a function as an argument and registers it as an observer of the store. The observer function will be called every time the store's state is updated, and will be passed the current state of the store and a list of the changes that were made to the store. This method returns a void function that removes the observer when called.

- `omit`: Takes an array of keys and removes them from the store. This method will only send updates to observers if the state has changed, and returns a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) object containing the keys that were removed from the store.

- `last`: A method that returns the current state of the store.

# Examples

## Initializing the store with the initial state

To initialize the store with the initial state, you can pass an initial state object to the `mapYobta` function. This will create a `Map` object from the initial state object and use it as the store's initial state.

```ts
import { localStoragePluginYobta } from '@yobta/stores'

const initialState = {
  foo: 'bar',
  baz: 123,
}

const store = mapYobta(initialState)
```

## Retrieving the state

To retrieve the current state from the store, you can use the `getState` method of the store object.

```ts
const currentState = store.getState()
```

## Assigning to the state and retrieving the changes

To assign new values to the store's state and retrieve the changes, you can use the `assign` method of the store object. This method takes a patch object containing the keys and values to be updated in the state, and returns a `Map` object containing the changes.

```ts
const patch = {
  foo: 'new value',
  baz: 456,
}

const changes = store.assign(patch)
```

## Omitting the keys and retrieving the changes

To omit keys from the store's state and retrieve the changes, you can use the `omit` method of the store object. This method takes an array of keys to be omitted from the state, and returns a `Set` object containing the omitted keys.

```ts
const keysToOmit = ['foo']

const changes = store.omit(keysToOmit)
```

## Observing store updates

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
  source: 'user action',
}

const changes = store.assign(patch, metadata)
```

In this example, the `metadata` object will be passed to the observer functions along with the current state and the changes that were made to the store.

Here is an example of using the `omit` method with an overload:

```ts
const keysToOmit = ['foo']

const metadata = {
  source: 'user action',
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

## Extending the store with one plugin

To extend the store with a plugin, you can pass the plugin as an argument to the `mapYobta` function when creating the store. The plugin should be an object with a `middleware` method that takes the store's `next` method as an argument and returns a new `next` method.

Here is an example of using the [Local Storage Plugin](../../plugins/localStoragePluginYobta/index.md) plugin, which replicates the store's state to local storage and synchronizes changes between active store instances:

```ts
const store = mapYobta(
  { key: 'value' },
  localStoragePluginYobta({
    channel: 'my-map-store-yobta',
    codec: mapCodecYobta,
  }),
)
```

Note that the `codec` property of the Local Storage plugin is optional. However, when using the plugin with a `mapYobta` store, a `codec` is required to serialize the store's state to JSON. If the state has nested maps, sets, or other types that cannot be easily serialized to JSON, you may need to create your own codec.

## Extending the store with multiple plugins

To extend the store with multiple plugins, you can pass multiple plugin objects as arguments to the `mapYobta` function when creating the store. The plugins will be applied in the order they are passed, with each plugin's `middleware` method wrapping the previous plugin's `middleware` method. This means that each middleware receives updates from the middleware added by the next plugin.

Here is an example of using the [Lazy](../../plugins/lazyPluginYobta/index.md) and [Validation](../../plugins/validationPluginYobta/index.md) plugins:

```ts
const store = mapYobta(
  { key: 'value' },
  lazyPluginYobta,
  validationPluginYobta(state => state.get('key') === 'value'),
)
```

When the store is unsubscribed, the middleware of the `validationPluginYobta` will receive the state first, and then the output will be passed to the middleware of the `lazyPluginYobta` plugin.

The `validationPluginYobta` plugin takes a validation function as an argument, which is called with the store's state before each update. If the validation function throws an error, the state is forced to the default state by the middleware. If the validation function returns a valid state, the update is allowed to proceed.

The `lazyPluginYobta` plugin resets the store to the initial state when it is left by its last observer. This can be useful for optimizing the performance of the store by avoiding unnecessary updates when the store is not being used.
