&larr; [Home](../../../README.md)

# Yobta Store

Creates an observable store for storing and observing the changes of a value. Designed to be easy to use and extend with plugins that add middleware to state transitions.

## Features

The `createStore` store has the following features:

- Provides a default value when the store is created
- Allows for the extension of the store with plugins that add middleware to state transitions
- Allows for the updating and reading of the store's state
- Allows for the observation of the store's state, with the option to unsubscribe
- Allows for the subscription to store `ready` and `idle` events

## Creating a Basic Store

To create a store, you can use the `createStore` factory function with just the default state value. For example:

```ts
import { createStore } from '@yobta/stores'

let store = createStore(1)
```

## Accessing the Store's State

To access the store's current value, you can use the `last` method:

```ts
const currentValue = store.last()
```

## Updating the Store's State

To update the store's value, you can use the `next` method, which takes a new value as an argument:

```ts
store.next(1)
```

## Observing the Store's State

To observe the store's state, use the `observe` method. This method takes in a callback function, which will be called every time the store's state is updated. The `observe` method also returns an `unsubscribe` function, which can be used to stop observing the store. For example:

```ts
let unsubscribe = store.observe(console.log)

// Later, when you want to stop observing:
unsubscribe()
```

## Extending Stores With Plugins

There are a number of [plugins](../../plugins/index.md) available that you can use to extend your stores. You can add any number of plugins to your stores to enhance their functionality.

To extend a store with a plugin, simply pass the plugin as an additional argument to the `createStore` factory function when creating the store.

For example, to extend a store with the [lazy plugin](../../plugins/lazyPluginYobta/index.md) which resets the store to its initial state when the last observer leaves the store, you can do the following:

```ts
import { createStore, lazyPluginYobta } from '@yobta/stores'

const store = createStore(0, lazyPluginYobta) // Create an enhanced store
const unobserve = store.observe(console.log) // Add an observer
store.next(1) // Change the store value
console.log(store.last()) // Check the store value
unobserve() // Remove the observer
console.log(store.last()) // Check the store value
```

## Subscribing to Store Events

Each store has `on` method which allows you to subscribe to store [lifecycle events](../../plugins/index.md#store-events). Subscribers receive the current store value before.

### Before Update

Fires when a new state was entered, but before the state's entry action was executed.

```js
const unsubscribe = store.on('before', state => {
  console.log(`The state will be upated to: ${state}`)
})

// Later if you need to:
unsubscribe()
```

### Ready

Fires after a first observer was added to the store.

```js
const unsubscribe = store.on('ready', state => {
  console.log(`Ready with: ${state}`)
})

// Later if you need to:
unsubscribe()
```

### Idle

Fires after a last observer was removed form the store.

```js
const unsubscribe = store.on('idle', state => {
  console.log(`Idle with: ${state}`)
})

// Later if you need to:
unsubscribe()
```

## Overloads

Overloads are a feature that allow you to pass additional information, or metadata, along with updates to a store's value. They can be used by observers and the `next` middleware to better understand the context of the update. All stores support overloads, and you can pass any number of overloads when updating the store's value.

```js
const myPlugin = ({ addMiddleware }) => {
  addMiddleware('next', (value, meta) => {
    console.log(`The store will update to: ${value}. Operation: "${meta.type}"`)
    return state
  })
}
const store = createStore(0, myPlugin)
store.observe((value, meta) => {
  console.log(`The store has updated to: ${value}. Operation: "${meta.type}"`)
})
store.next(1, { type: 'increment' })
```

## Using with Typescript

When using Typescript with `@yobta/stores`, the types of the store's values can usually be inferred from the initial state. However, in some cases, it may be necessary to explicitly specify the types of the values.

For the overloads, the types cannot be inferred and are treated as an array of `any` by default. To specify the types of the overloads, you can define the `Oveloads` type.

Here's an example of how to use createStore with Typescript:

```ts
type State = { name?: string }
type Oveloads = [{ action: string }]

const store = createStore<State, Oveloads>({})
store.next({ name: 'yobta' }, { action: 'set name' })
```
