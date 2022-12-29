&larr; [Home](../../../README.md)

# Yobta Store

`storeYobta` is a factory function that creates an observable store, which serves as a base store for all other stores in the `@yobta/stores` package. An observable store is a simple data structure that allows you to store a value and subscribe to changes to that value. The `storeYobta` store is designed to be easy to use and extend with plugins that add middleware to state transitions.

## Features

The `storeYobta` store has the following features:

- Provides a default state when the store is created
- Allows for the extension of the store with plugins that add middleware to state transitions
- Allows for the updating and reading of the store's state
- Triggers events on registered plugins when the state is updated
- Allows for the observation of the store's state, with the option to unsubscribe
- Allows for the subscription to store events

## Creating a Basic Store

To create a store, you can use the `storeYobta` factory function with just the default state value. For example:

```ts
import { storeYobta } from '@yobta/stores'

let store = storeYobta(1)
```

## Creating a Store With Plugins

To create a `storeYobta` store with plugins, you can pass in any number of plugins as additional arguments to the `storeYobta` factory function after the initial state value. For example:

```ts
import { storeYobta, lazyPluginYobta } from '@yobta/stores'

// Create an enhanced store
const store = storeYobta(0, lazyPluginYobta)
```

## Accessing and Updating the Store's State

To access and update the state of a store, use the `last` and `next` methods. The `last` method retrieves the current state of the store, while the `next` method updates the store's state with a new value. For example:

```ts
const counter = storeYobta(0)

export const increment = () => {
  const currentState = counter.last() // Get the current state of the store
  const newState = currentState + 1 // Add 1 to the current state to create a new state
  counter.next(newState) // Update the store's state with the new value
}
```

## Observing the Store's State

To observe the store's state, use the `observe` method. This method takes in a callback function, which will be called every time the store's state is updated. The `observe` method also returns an `unsubscribe` function, which can be used to stop observing the store. For example:

```ts
let unsubscribe = store.observe(console.log)

// Later, when you want to stop observing:
unsubscribe()
```

## Events

All `@yobta/stores` support the following lifecycle events:

- `ready`: fires when the first observer adds to the store
- `idle`: fires when the last observer leaves the store
- `next`: fires on every store update

You can use these events to trigger actions in your application, such as fetching data or updating UI.

## Extending Stores With Plugins

There are a number of [plugins](../../plugins/index.md) available that you can use to extend your stores. You can add any number of plugins to your stores to enhance their functionality.

Plugins allow you to add middlewares to store lifecycle events. A middleware is a function that is executed during a state transition in the store. Middlewares allow you to silently modify the store value during transitions without firing update events.

To extend a store with a plugin, simply pass the plugin as an additional argument to the `storeYobta` factory function when creating the store.

For example, to extend a store with the [lazy plugin](../../plugins/lazyPluginYobta/index.md) which resets the store to its initial state when the last observer leaves the store, you can do the following:

```ts
// Import the store factory and lazy plugin
import { storeYobta, lazyPluginYobta } from '@yobta/stores'

// Create an enhanced store
const store = storeYobta(0, lazyPluginYobta)

// Add an observer
const unobserve = store.observe(console.log)

// Change the store value
store.next(1) // an observer will trace 1 to the console

// Check the store value
console.log(store.last()) // will trace 1

// Remove the observer
unobserve()

// Check the store value
console.log(store.last()) // will trace 0
```

## Typing the Store State

When using Typescript, stores are typically able to infer the types of their values based on the initial states. However, in some cases, it may be necessary to explicitly specify the value types. This can be done using the following syntax:

```ts
const store = storeYobta<{ name?: string }>({})

store.next({ name: 'yobta' })
```

## Subscribing to Store Events

Each store has a method called `on` which allows you to subscribe to store lifecycle events. Subscribers receive an updated store value before the transition is applied, meaning that inside a subscriber, you can access the next store value as an argument and the previous value using the store's `last` method.

Note that you cannot update the store value by calling the `next` method synchronously inside a subscriber. Doing so will result in an error.

```ts
const store = storeYobta(0)

const unsubscribe = store.on('next', nextState => {
  console.log(`Next state is ${nextState}`, `Last state is ${store.last()}`)

  store.next(2) // will throw an error
})

// Later if you need to:
unsubscribe()
```

## Context

The `context` data can be added to stores when adding observers. The store will send the context to the subscribers. The store updates the context only when the first observer is added, and when the last observer leaves the store, the context is updated to `null`. If the `observe` method does not have a context, then the store sends `null` to subscribers.

The context is useful when you need to add side effects to your stores. In TypeScript, you need to explicitly type the context.

In the following example, we will create a store that holds a news item:

```ts
type NewsItem = {
  title: string
  description: string
}

type Context = {
  id: number
}

const store = storeYobta<NewsItem | null, Context>(null)

store.on('ready', (_next, context) => {
  // Note that you can update the store value as follows because the fetching works asynchronously
  fetchNewsItem<NewsItem>(context.id).then(store.next)
})

store.observe(console.log, { id: 1 })
```

## Overloads

Overloads are a feature that allow you to pass additional information, or metadata, along with updates to a store's value. They can be used by observers and subscribers to better understand the context of the update. All stores support overloads, and you can pass any number of overloads when updating the store's value.

```ts
const store = storeYobta(0)

const add = number => {
  let value = store.last() + number
  let meta = {
    operation: 'add',
    payload: number,
  }
  store.next(value, operation)
}

store.on('next', (value, meta) => {
  console.log(`The store will update to ${value}. Added ${meta.payload}`)
})

store.observe((value, meta) => {
  console.log(`The store has updated to ${value}. Added ${meta.payload}`)
})
```
