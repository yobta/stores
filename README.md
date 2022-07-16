# Yobta/stores

A collection of tiny observable stores designed to move logic away from components and help write reactive applications.

- **Small**. 162–674 Bytes
- **Tree-shakable**.
- **ESM-only**.
- **Typescript**.

## Istallation

```
npm i @yobta/stores
```

## Documentation

### Key Concepts

- [Basic store](./docs/observable.md) tutorial
- Using with React
- Store plugins

### Stores

```ts
import { observableYobta } from '@yobta/stores'

const numberStore = observableYobta(123)

export const increment = numberStore.next(last => last + 1)

numberStore.subscribe(console.log)

increment() // => 124
```

## Lazy Observable Store

This will create a lazy singleton store that will reset it's state as last observer leaves

```ts
import { observableYobta, lazyYobta } from '@yobta/stores'

const numberStore = observableYobta(123, lazyYobta)
const unobserve = numberStore.observe(console.log)

export const increment = numberStore.next(last => last + 1)

increment() // => 124
unobserve()

console.log(numberStore.last()) // => 123
```

## Replicated Lazy Observable Store

This will create a lazy singleton store that will be replicated via the browser's local storage

```ts
import {
  observableYobta,
  lazyYobta,
  replicatedYobta,
  localStorageYobta,
} from '@yobta/stores'

const numberStore = observableYobta(
  123,
  lazyYobta,
  replicatedYobta({ channel: 'yobta', backend: localStorageYobta }),
)

localStorage.set('yobta', 456)
const unobserve = numberStore.subscribe(console.log) // => 456

unobserve()
console.log(numberStore.last()) // => 123
```

## Replicate to a Different Backend

```ts
import { observableYobta, lazyYobta, replicatedYobta } from '@yobta/stores'

const backend = {
  publish(channel, message) {}
  subscribe(channel) {
    return unsubscribe
  }
}

const numberStore = observableYobta(
  123,
  lazyYobta,
  replicatedYobta({ channel: 'yobta', backend })
)
```

## React Hook

```ts
import { observableYobta } from '@yobta/stores'
import { useObservable } from '@yobta/stores/react'

const myTab = lazyYobta('info')

export const useTabs = () => useObservable(myTab)
```

Kudos:

- [`Andrey Sitnik`] — nanostores and the boilerplate

[`andrey sitnik`]: https://sitnik.ru
[`nanostores`]: https://github.com/nanostores/nanostores
[`usestate`]: https://reactjs.org/docs/hooks-reference.html#usestate

```

```
