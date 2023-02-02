&larr; [Home](../../../README.md)

# derived Store

Aggregates data from one or multiple stores into a single, read-only store.

```js
import { storeYobta, derivedYobta } from '@yobta/stores'

const store1 = storeYobta(1)
const store2 = storeYobta(1)
const derived = derivedYobta(
  (state1, state2) => state1 + state2,
  store1,
  store2,
)
```
