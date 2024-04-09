&larr; [Home](../../../README.md)

# Modal Store

The Modal Store is a unique stack designed for managing modal elements in a web application, ensuring that only one instance of any item exists in the stack at any given time. It provides methods for adding, removing, and observing modal elements, as well as checking the current stack size.

## Importing

To use the Modal Store in your project, start by importing it:

```ts
import { createModalStore } from '@yobta/stores'
```

## Creating a Store

Create a new Modal Store by specifying an initial state. This state should be an array of items you want to initialize the store with:

```ts
const initialState: string[] = []
const myModalStore = createModalStore<string>(initialState)
```

## Adding Items

To add a new item to the store, use the `add` method. This method ensures that the item is unique within the store, adding it to the top of the stack:

```ts
myModalStore.add('myModal')
```

## Removing Items

To remove an item from the store, use the `remove` method. This method returns `true` if the item was successfully removed, or `false` if the item was not found in the store:

```ts
const wasRemoved = myModalStore.remove('myModal')
```

## Getting the Top Item

Retrieve the item at the top of the stack using the `last` method. This is the most recently added unique item:

```ts
const topItem = myModalStore.last()
```

## Observing Changes

Watch for changes in the Modal Store by using the `observe` method. This allows you to react to additions and removals of items in the store:

```ts
const observer = (item: string | undefined) => {
  console.log(`Top item is now: ${item}`)
}
myModalStore.observe(observer)
```

Observers will be notified with the current top item and any overloads provided to the `add` or `remove` methods, facilitating rich interactions based on store updates.

## Size of the Store

The current size of the stack can be checked at any time through the `size` method:

```ts
const currentSize = myModalStore.size()
```

## Overloads

The `add` and `remove` methods support overloads, allowing additional arguments to be passed and handled by observers. This provides a way to include extra context or data when items are added or removed from the store:

```ts
myModalStore.add('newModal', 'additionalInfo')
myModalStore.remove('existingModal', 'contextInfo')
```

## Example Usage

Example setup demonstrating how to manage modal elements within your application using the Modal Store:

```ts
// Setting up the store
const myModalStore = createModalStore<string>(['initialModal'])

// Adding a modal
myModalStore.add('anotherModal')

// Observing changes
myModalStore.observe((item, ...overloads) => {
  console.log(`The top modal is now: ${item}`, `Overloads:`, overloads)
})

// Removing a modal
const wasRemoved = myModalStore.remove('anotherModal')
console.log(`Was the modal removed? ${wasRemoved}`)

// Checking the size of the modal store
console.log(`Current modal store size: ${myModalStore.size()}`)
```

This setup provides a structured approach to managing modal elements, ensuring uniqueness and offering insights into the state changes through observers.
