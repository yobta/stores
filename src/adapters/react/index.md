&larr; [Home](../../../README.md)

# Using with React

This hook allows a React component to subscribe to changes in a `@yobta/stores`. When the state of the store changes, the hook will trigger a re-render of the component to reflect the updated state.

```ts
import { useYobta } from '@yobta/stores/react'

const store = storeYobta(0)
const increment = () => {
  const state = store.last() + 1
  store.next(state)
}

function MyComponent() {
  const state = useYobta(store)
  return <button onClick={increment}>Clicked: {state}</button>
}
```
