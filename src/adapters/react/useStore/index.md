&larr; [Home](../../../../README.md)

# Using with React

This hook allows a React component to subscribe to changes in a `@yobta/stores`. When the state of the store changes, the hook will trigger a re-render of the component to reflect the updated state.

```ts
import { useStore } from '@yobta/stores/react'

const store = createStore(0)
const increment = () => {
  const state = store.last() + 1
  store.next(state)
}

function MyComponent() {
  const state = useStore(store)
  return <button onClick={increment}>Clicked: {state}</button>
}
```

## Server Rendering

To properly utilize the store hook for server-side rendering, you must supply the `serverState` option.

```js
const serverState = 0
const state = useYobta(store, { serverState })
```
