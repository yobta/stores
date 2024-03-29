&larr; [Home](../../../README.md)

# Local Storage Plugin

A factory function for creating a store plugin that synchronizes the state with [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). The plugin instance should be passed as an argument to a store factory and added after the initial state. Synchronization only works when a store has active observers. A disconnected store can write updates to localStorage, but it cannot receive them. When a first observer is added, the store tries to read the state from localStorage and decode it with the codec. If localStorage is empty, then the store keeps its current state.

## Usage

```ts
import { createStore, localStoragePlugin } from '@yobta/stores'

const store = createStore(
  1,
  localStoragePlugin({
    channel: 'my-store-yobta',
  }),
)
```

## Arguments

The plugin factory function accepts an object with the following properties:

- `channel` (string) — The key in localStorage to use for storing the state.
- `codec` (YobtaCodec, optional) The codec to use for serializing and deserializing the state. Defaults to `jsonCodec`.

## Codec

The default codec provided by YobtaStorePlugin is able to decode simple values such as numbers, strings, and booleans, as well as arrays and plain objects. However, for more complex data structures like maps and sets, a special codec may be required to properly serialize and deserialize the state. This can be done by specifying an codec function as an optional argument when creating the localStoragePlugin instance. The codec function should be able to handle the serialization and deserialization of the desired data structure, allowing the store to properly synchronize with localStorage.

```ts
import { createMapStore, localStoragePlugin, mapCodec } from '@yobta/stores'

const store = createMapStore(
  { key: 'value' },
  localStoragePlugin({
    channel: 'my-map-store-yobta',
    codec: mapCodec,
  }),
)
```

## See Also

- [Store Plugins](../index.md)
