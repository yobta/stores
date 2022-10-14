&larr; [Home](../README.md)

# Replication

Replicatied stores persist their values between page reloads.

###### Adding the replication middleware to the stores

```ts
import {
  observableYobta,
  replicatedYobta,
  localStorageYobta,
} from '@yobta/stores'

const numberStore = observableYobta(
  0,
  replicatedYobta({
    channel: 'numberStore',
    backend: localStorageYobta, // you can also sessionStorageYobta or create your own backend
  }),
)
```

The replication activates at when a store is observed

```ts
const unobserve = numberStore.observe(console.log)

numberStore.next(1) // this change will be persisted

unobserve()

numberStore.next(1) // this change will not be persisted
```
