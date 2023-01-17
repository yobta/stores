# Store Effect Utility

The utility enables you to set up callbacks for the store's `ready` and `idle` events. This feature
is useful for creating subscribe/unsubscribe actions to synchronize the store with external peers.
The callback will be executed when the store is first observed. It should return a function that
will be invoked when the last observer leaves the store.

```js
import { storeYobta, storeEffectYobta } from '@yobta/stores'

const store = storeYobta(null)
const callback = state => {
  let unsubscribe = subscribeToUpdates(state, store.next)
  return unsubscribe
}
const cancelEffect = storeEffectYobta(store, callback)
// Later when you need to:
cancelEffect()
```
