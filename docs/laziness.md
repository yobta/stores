&larr; [Home](../README.md)

# Laziness

Lazy stores automatically reset to the initial state when the last store observer disconnects.

###### Adding the lazy middleware

```ts
import { observableYobta, lazyYobta } from '@yobta/stores'

const numberStore = observableYobta(0, lazyYobta)
```

###### counterPage.tsx

```ts
const unobserve = numberStore.observe(console.log)

numberStore.next(1) // will trace 1

unobserve()

numberStore.last() // will trace 0
```
