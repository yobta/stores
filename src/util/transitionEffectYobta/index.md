# Transition Effect Utility

The utility enables you to execute a callback before the store state transitions to another state. This utility is particularly useful for adding side effects to [state machines](../../stores/machineYobta/index.md).

```js
import { machineYobta, transitionEffectYobta } from '@yobta/stores'

const store = machineYobta({
  idle: ['fetching'],
  fetching: ['idle', 'error'],
  error: ['idle', 'fetching'],
})('idle')
let retryCount = 0
const unsubscribe = transitionEffectYobta(store, 'fetching', () => {
  if (store.last() === 'error') {
    retryCount = retryCount + 1
  }
})
// Later when you need to:
unsubscribe()
```
