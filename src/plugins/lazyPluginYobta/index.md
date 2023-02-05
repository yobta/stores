&larr; [Home](../../../README.md)

# Lazy Plugin

A plugin for the [@yobta/stores](https://www.npmjs.com/package/@yobta/stores) package that resets the store to its initial state when the last observer leaves. This can be useful in situations where you want to ensure that the store is only updated when it is actively being observed, and that it is reset to its initial state when it is no longer needed.

## Usage

To use the Lazy Plugin Yobta, import it into your project and pass it as an argument to the store factory:

```ts
import { createStore, lazyPluginYobta } from '@yobta/stores'

const store = createStore(0, lazyPluginYobta)
```

Then, you can observe the store using the observe method:

```ts
const unsubscribe = store.observe(console.log)
```

You can then update the store using the next method:

```ts
store.next(1)
```

When you are finished observing the store and want to reset it to its initial state, you can call the unsubscribe function returned by the observe method:

```ts
unsubscribe()
```

You can expect the store to be reset to the initial state:

```ts
console.log(store.last()) // 0
```

## Limitations

One potential limitation of the Lazy Plugin is that it may interfere with other plugins that you are using in your project. In particular, you should be careful when using the Lazy Plugin in combination with persistency plugins such as the Local Storage Plugin, as resetting the store to its initial state may overwrite any persisted data.

Keep these considerations in mind when deciding whether or not to use the Lazy Plugin in your project.
