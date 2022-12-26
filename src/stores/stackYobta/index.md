# Stack Store

The Stack Store is a data structure for storing items in a last-in, first-out (LIFO) order. It provides methods for adding and removing items, observing changes to the stack, and getting the current size of the stack.

## Overview

The Stack Store is implemented as a factory function that returns an object with methods for interacting with the stack. It is created using the `stackYobta` function, which takes an initial state and an optional list of plugins. The initial state must be provided as a `Set` or an array of items, and the plugins can be used to extend the functionality of the stack.

## Features

The Stack Store provides the following methods:

- `add(member: Item, ...overloads: any[])`: Adds a new item to the stack. Returns `true` if the item was successfully added, `false` otherwise.
- `last(): Item`: Returns the last item added to the stack.
- `observe(observer: YobtaObserver<Set<Item>>): VoidFunction`: Registers an observer function to be called whenever the stack is updated. The observer function is passed the updated stack set as the first argument, and any additional overloads as additional arguments.
- `remove(member: Item, ...overloads: any[]): boolean`: Removes an item from the stack. Returns `true` if the item was successfully removed, `false` otherwise.
- `size(): number`: Returns the number of items in the stack.

## Importing

To use the Stack Store in your project, you can import it using the following syntax:

```ts
import { stackYobta } from '@yobta/stores'
```

## Creating a Store

To create a new Stack Store, you must provide an initial state when using the `stackYobta` function:

```ts
const initialState = []
const myStack = stackYobta<number>(initialState)
```

## Getting the Last Item

To get the last item added to the stack, you can use the `last` method:

```ts
const lastItem = myStack.last()
```

## Adding New Items

To add a new item to the stack, you can use the `add` method:

```ts
myStack.add(4)
```

The `add` method returns `true` if the item was successfully added, and `false` if the item already exists in the stack.

## Removing the Last Item

To remove the last item from the stack, you can use the `remove` method:

```ts
myStack.remove(4)
```

The `remove` method returns `true` if the item was successfully removed, and `false` if the item does not exist in the stack.

## Observing Changes

To observe changes to the stack, you can use the `observe` method:

```ts
const observer = (stack: Set<number>) => {
  console.log(`Stack changed: ${Array.from(stack)}`)
}
myStack.observe(observer)
```

The `observe` method takes an `observer` function as an argument. This function will be called whenever the stack is updated, with the updated stack set as the first argument and any additional overloads passed as additional arguments.

You can also unregister the observer by calling the `unobserve` method on the returned function:

```ts
const unobserve = myStack.observe(observer)
unobserve()
```

## Overloads

The `add`, `remove`, and `observe` methods support overloads, which are additional arguments that can be passed to the methods. These overloads can be used to provide additional context or data when interacting with the stack.

For example, you can use the `add` method with overloads like this:

```ts
myStack.add(4, 'additional_data', { more_data: 123 })
```

The overloads will be passed to the observer function as additional arguments:

```ts
const observer = (stack: Set<number>, ...overloads: any[]) => {
  console.log(`Stack changed: ${Array.from(stack)}`)
  console.log(`Overloads: ${overloads}`)
}
myStack.observe(observer)
```

The `remove` method also supports overloads in the same way.

## Extending the store with one plugin

To extend the store with a plugin, you can pass the plugin as an argument to the `stackYobta` function when creating the store. The plugin should be an object with a `middleware` method that takes the store's `next` method as an argument and returns a new `next` method.

Here is an example of using the [Local Storage Plugin](../../plugins/localStoragePluginYobta/index.md) plugin, which replicates the store's state to local storage and synchronizes changes between active store instances:

```ts
const initialState = []
const store = stackYobta<number>(
  initialState,
  localStoragePluginYobta({
    channel: 'my-stack-store-yobta',
    codec: setCodecYobta,
  }),
)
```

Note that the `codec` property of the Local Storage plugin is optional. However, when using the plugin with a `stackYobta` store, a `codec` is required to serialize the store's state to JSON. If the state has nested maps, sets, or other types that cannot be easily serialized to JSON, you may need to create your own codec.

## Extending the store with multiple plugins

To extend the store with multiple plugins, you can pass multiple plugin objects as arguments to the `stackYobta` function when creating the store. The plugins will be applied in the order they are passed, with each plugin's `middleware` method wrapping the previous plugin's `middleware` method. This means that each middleware receives updates from the middleware added by the next plugin.

Here is an example of using the [Lazy](../../plugins/lazyPluginYobta/index.md) and [Validation](../../plugins/validationPluginYobta/index.md) plugins:

```ts
const store = stackYobta<number>(
  initialState,
  lazyPluginYobta,
  validationPluginYobta(state =>
    [...state].every(item => typeof item === 'number'),
  ),
)
```

When the store is unsubscribed, the middleware of the `validationPluginYobta` will receive the state first, and then the output will be passed to the middleware of the `lazyPluginYobta` plugin.

The `validationPluginYobta` plugin takes a validation function as an argument, which is called with the store's state before each update. If the validation function throws an error, the state is forced to the default state by the middleware. If the validation function returns a valid state, the update is allowed to proceed. In this case, the validation function verifies that the state is a set containing only numeric values.

The `lazyPluginYobta` plugin resets the store to the initial state when it is left by its last observer. This can be useful for optimizing the performance of the store by avoiding unnecessary updates when the store is not being used.
