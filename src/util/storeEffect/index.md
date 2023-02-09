# Store Effect Utility

The utility enables you to set up callbacks for the store's `ready` and `idle` events. This feature
is useful for creating subscribe/unsubscribe actions to synchronize the store with external peers.
The callback will be executed when the store is first observed. It should return a function that
will be invoked when the last observer leaves the store.

```js
import { createStore, storeEffect } from '@yobta/stores'

const store = createStore(null)
const callback = state => {
  let unsubscribe = subscribeToUpdates(state, store.next)
  return unsubscribe
}
const cancelEffect = storeEffect(store, callback)
// Later when you need to:
cancelEffect()
```
