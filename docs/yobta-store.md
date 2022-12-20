&larr; [Home](../README.md)

# Yobta Store

The Yobta Store is a module that provides a simple state management solution. It allows you to create a store that holds a single value, and provides methods for updating and observing the value.

## Features

- Provides a default state when the store is created
- Allows for the updating of the store's state
- Allows for the reading the store's state
- Triggers events on registered plugins when the state is updated
- Allows for the observation of the store's state, with the option to unsubscribe

## Importing

To use the Yobta Store in your project, you will first need to import it. You can do this by adding the following line to the top of your file:

```ts
import { storeYobta } from '@yobta/stores'
```

## Creating a Store

To create a Yobta Store, you can use the `storeYobta` function. This function takes in a default state value, and an optional list of plugins. Here's an example of creating a store with a default state of `1`:

```ts
let store = storeYobta(1)
```

## Updating the Store's State

To update the store's state, you can use the `next` method. This method takes in a new value, and updates the store with it. Here's an example of updating the store's state from `1` to `2`:

```ts
store.next(2)
```

## Reading the Store's State

The state of a store can be accessed using the `last` method, which returns the current state of the store. Here is an example of how to use the `last` method to read the state of a store:

```ts
const counter = storeYobta(0)

// get the current state of the store
const state = counter.last()

// increment the state by 1
const newState = state + 1

// update the store's state with the new value
counter.next(newState)
```

## Observing the Store's State

To observe the store's state, you can use the `observe` method. This method takes in a callback function, which will be called every time the store's state is updated. You can also use the returned `unsubscribe` function to stop observing the store. Here's an example of observing the store's state:

```ts
let unsubscribe = store.observe(console.log)

// Later, when you want to stop observing:
unsubscribe()
```

## See Also

- [Store Plugins](./store-pligins.md)
