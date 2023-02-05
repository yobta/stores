&larr; [Home](../../../../README.md)

# Creating React Hook

The `createHookFromStore` factory is a utility for creating React hooks from stores.

## Creating Hooks

```js
import { createStore } from '@yobta/stores'
import { createHookFromStore } from '@yobta/stores/react'

const myStore = createStore(1)
export const useMyStore = createHookFromStore(myStore)
```

## Using Hooks

```jsx
import { useMyStore } from './my-store'

export const myComponent = () => {
  let myValue = useMyStore()
  return <>My value is: {myValue}</>
}
```
