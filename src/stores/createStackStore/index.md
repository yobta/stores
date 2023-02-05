&larr; [Home](../../../README.md)

# Stack Store

The Stack Store is a data structure for storing items in a last-in, first-out (LIFO) order. It provides methods for adding and removing items, observing changes to the stack, and getting the current size of the stack.

## Importing and Initializing

To use the Stack Store in your project, you can import it using the following syntax:

```ts
import { createStackStore } from '@yobta/stores'
const myStack = createStackStore<number>([])
```

## Creating a Store

To create a new Stack Store, you must provide an initial state when using the `createStackStore` function:

```ts
const initialState = []
const myStack = createStackStore<number>(initialState)
```

## Adding New Items

To add a new item to the stack, you can use the `add` method:

```ts
myStack.add(1)
```

The `add` method returns `true` if the item was successfully added, and `false` if the item already exists in the stack.

## Removing Items

To remove any item from the stack, you can use the `remove` method:

```ts
myStack.remove(4)
```

The `remove` method returns `true` if the item was successfully removed, and `false` if the item does not exist in the stack.

## Getting the Last Item

To get the last item added to the stack, you can use the `last` method:

```ts
const lastItem = myStack.last()
```

## Observing Changes

To observe changes to the stack, you can use the `observe` method:

```ts
const observer = stack => {
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

The `add` and `remove` methods support overloads, which are additional arguments that can be passed to the methods. These overloads can be used to provide additional context or data when interacting with the stack.

For example, you can use the `add` method with overloads like this:

```ts
myStack.add(4, 'additional_data', { more_data: 123 })
```

The overloads will be passed to the observer function as additional arguments:

```ts
const observer = (stack, ...overloads) => {
  console.log(`Stack changed: ${Array.from(stack)}`)
  console.log(`Overloads: ${overloads}`)
}
myStack.observe(observer)
```

The `remove` method also supports overloads in the same way.

## Plugins

The store supports plugins in the same way that other stores do. Refer to the [Plugins](../../plugins/index.md) page for more information.

However, there is an edge case to consider when using plugins that utilize the JSON codec. The stack store is a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) data structure, and therefore requires a set codec.

Here is an example of using the [Local Storage Plugin](../../plugins/localStoragePlugin/index.md), which replicates the store's state to local storage and synchronizes changes between active store instances:

```ts
import { createStackStore, setCodec } from '@yobta/stores'

const initialState = new Set()
const store = createStackStore(
  initialState,
  localStoragePlugin({
    channel: 'my-map-store-yobta',
    codec: setCodec,
  }),
)
```

## Subscribing to Store Events

The Stack store supports the same events as other stores. For more information, see the [Store documentation](../createStore/index.md).
