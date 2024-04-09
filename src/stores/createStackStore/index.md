&larr; [Home](../../../README.md)

# Stack Store

The Stack Store is a data structure for storing items in a last-in, first-out (LIFO) manner. It offers methods to add or remove items, observe changes, and check the current stack size.

## Importing and Initializing

To integrate the Stack Store into your project:

```ts
import { createStackStore } from '@yobta/stores'
```

## Creating a Store

Initialize the Stack Store with an initial state:

```ts
const initialState: string[] = []
const myStack = createStackStore<string>(initialState)
```

## Adding Items

Use the `push` method to add items. This method returns the new stack size:

```ts
myStack.push('item1')
```

## Removing Items

Use the `pop` method to remove the last item. It returns the removed item or `undefined` if the stack was empty:

```ts
const item = myStack.pop()
```

## Getting the Last Item

Retrieve the last item using the `last` method:

```ts
const lastItem = myStack.last()
```

## Observing Changes

To watch for changes, utilize the `observe` method:

```ts
const observer = (item: string | undefined) => {
  console.log(`New last item: ${item}`)
}
myStack.observe(observer)
```

Observers are notified with the new last item and any overloads provided to the `push` or `pop` methods. This enables more nuanced control and response mechanisms based on stack changes.

## Size of the Store

You can check the current size of the stack at any time by calling the `size` method:

```ts
const currentSize = myStack.size()
```

## Overloads

Both `push` and `pop` methods accept additional arguments (overloads) that are passed along to observers. This allows for more detailed tracking and reaction to changes in the stack:

```ts
myStack.push('newItem', 'additionalInfo')
myStack.pop('contextInfo')
```

Observers will receive these overloads alongside the stack's latest state, providing rich context for each update.

## Example Usage

Here's how you might set up a stack store, add items, remove items, and subscribe to updates:

```ts
// Setting up the store
const myStack = createStackStore<string>(['initialItem'])

// Adding an item
myStack.push('anotherItem')

// Observing changes
myStack.observe((item, ...overloads) => {
  console.log(`The last item is now: ${item}`, `Overloads:`, overloads)
})

// Removing the last item
const removedItem = myStack.pop()
console.log(`Removed item: ${removedItem}`)

// Checking the size of the stack
console.log(`Current stack size: ${myStack.size()}`)
```
