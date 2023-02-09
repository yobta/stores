&larr; [Home](../../../README.md)

# Online Store

Creates a read-only observable store object that tracks the browser's connectivity state using the [Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine) property.

When the store is not active (has no observers), its value is `null`. When the store has active observers, its value is a `boolean` that represents the browser's connectivity state.

## Importing

```js
import { createConnectivityStore } from '@yobta/stores'

const store = createConnectivityStore()
```

## Observing Changes

```js
store.observe(console.log)
```

## Getting the State

```
store.last()
```
