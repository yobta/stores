&larr; [Home](../../../README.md)

# Session Storage Plugin

A factory function that creates a store plugin that allows for storing and retrieving the store's state in the browser's [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). It is designed to persist the state of the store between a tab reload in the same tab, but it will not synchronize state between different tabs.

## Usage

```ts
import { createStore, sessionStoragePluginYobta } from '@yobta/stores'

const store = createStore(0, sessionStoragePluginYobta({ channel: 'my-store' }))
```

In this example, the `sessionStoragePluginYobta` plugin is added to the store with the channel parameter set to 'my-store'. This will cause the store's state to be stored in session storage under the key 'my-store'. Whenever the store's state changes, the plugin will automatically update the value in session storage.

## Custom Codecs

The plugin allows for the use of custom codecs. To use a custom codec, pass it as the codec parameter in the plugin configuration object. Here is an example of how to use a custom codec with the plugin:

```ts
import {
  createMapStore,
  localStoragePluginYobta,
  mapCodecYobta,
} from '@yobta/stores'

const store = createMapStore(
  { key: 'value' },
  sessionStoragePluginYobta({
    channel: 'my-map-store-yobta',
    codec: mapCodecYobta,
  }),
)
```

## See Also

- [Store Plugins](../index.md)
