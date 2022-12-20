&larr; [Home](../README.md)

# Using with React

This hook allows a React component to subscribe to changes in a Yobta store. When the state of the store changes, the hook will trigger a re-render of the component to reflect the updated state.

## Importing

```ts
import { useYobta } from '@yobta/stores/react'
```

## Parameters

- `store` - The Yobta store to subscribe to. This store should have the following methods:
  - `last`: YobtaStateGetter<State> - A getter function that returns the current state of the store.
  - `observe(observer: YobtaObserver<any>): VoidFunction` - A function that allows the component to subscribe to changes in the store. The observer parameter is a callback function that will be called whenever the state of the store changes.

## Return value

The hook returns the current state of the store.

```ts
import { useYobta } from './useYobta'

const store = storeYobta(0)
const increment = () => store.next(store.last() + 1)

function MyComponent() {
  const state = useYobta(store)
  // component will re-render whenever the state of props.store changes
  return <button onClick={increment}>Clicked: {state}</button>
}
```
