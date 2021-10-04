# Yobta/stores
A collection of observable stores that I use in personal projects. Normally you use [`nanostores`] which is better documented and maintained.

## Istallation
`npm i @yobta/stores`
## Singleton store
A basic store that persists in a `window`

```ts
import { singletonYobta } from '@yobta/stores'
import { useStore } from '@yobta/stores/react'

const numberStore = singletonYobta(0)

numberStore.observe(console.info)

export const incrementNumber = () => numberStore.next(last => last + 1)
export const useNumber = () => useStore(numberStore)
```
## Lazy store
A store that maintains it's state only while it has at least one observer.
Normally you use it in when you don't need a persistency. The concept is very similar
to React's [`useState`] hook. 

```ts
import { singletonYobta } from '@yobta/stores'
import { useStore } from '@yobta/stores/react'

const myTab = lazyYobta('info')

export const setTab = numberStore.next

export const useTabs = () => useStore(myTab)
```



Kudos:
- [`Andrey Sitnik`] — nanostores and the boilerplate

[`Andrey Sitnik`]: https://sitnik.ru
[`nanostores`]: https://github.com/nanostores/nanostores
[`useState`]: https://reactjs.org/docs/hooks-reference.html#usestate
