&larr; [Home](../../../README.md)

# Derived Store

Aggregates data from one or multiple stores into a single, read-only store.

```js
import { createStore, derivedYobta } from '@yobta/stores'

const store1 = createStore(1)
const store2 = createStore(1)
const derived = derivedYobta(
  (state1, state2) => state1 + state2,
  store1,
  store2,
)
```
