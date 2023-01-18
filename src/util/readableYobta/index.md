&larr; [Home](../../../README.md)

# Readable Store Utility

Creates a read-only version of the store that can only be accessed using the `last`, `observe` and `on` methods and cannot be modified externally.

```js
import { storeYobta, readableYobta } from '@yobta/stores'

const store = storeYobta(0)
export const readOnlyStore = readableYobta(store)
```
