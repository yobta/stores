# Derrived Store

Aggregates data from one or multiple stores into a single, read-only store.

```js
const store1 = storeYobta(1)
const store2 = storeYobta(1)
const derrived = derrivedYobta(
  (state1, state2) => state1 + state2,
  store1,
  store2,
)
```
