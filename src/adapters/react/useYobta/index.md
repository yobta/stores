&larr; [Home](../../../../README.md)

# Using with React

This hook allows a React component to subscribe to changes in a `@yobta/stores`. When the state of the store changes, the hook will trigger a re-render of the component to reflect the updated state.

```ts
import { useYobta } from '@yobta/stores/react'

const store = createStore(0)
const increment = () => {
  const state = store.last() + 1
  store.next(state)
}

function MyComponent() {
  const state = useYobta(store)
  return <button onClick={increment}>Clicked: {state}</button>
}
```

## Server Rendering

To properly utilize the store hook for server-side rendering, you must supply the `getServerSnapshot` option. Failure to do so will result in a rendering error. For additional information, refer to the [React documentation](https://beta.reactjs.org/reference/react/useSyncExternalStore#adding-support-for-server-rendering).

```js
const getServerSnapshot = () => 0
const state = useYobta(store, { getServerSnapshot })
```
