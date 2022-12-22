&larr; [Home](../../../README.md)

# Session Storage Plugin

The `sessionStoragePluginYobta` plugin is a factory function that creates a plugin for a Yobta store that allows for storing and retrieving the store's state in the browser's session storage. It is designed to persist the state of the store between a tab reload in the same tab, but it will not synchronize state between different tabs.

The plugin uses a codec (a function for encoding and decoding the state) to serialize the store's state to a string that can be stored in session storage. The default codec, codecYobta, is able to deal with basic JavaScript structures such as arrays and plain objects (essentially, everything that can be serialized to JSON without extensions). For more complex structures such as maps and sets, a custom codec may be required.

Here is an example of how to use the `sessionStoragePluginYobta` plugin in a Yobta store:

## Usage

```ts
import { storeYobta, sessionStoragePluginYobta } from '@yobta/stores'

const store = storeYobta(0, sessionStoragePluginYobta({ channel: 'my-store' }))
```

In this example, the `sessionStoragePluginYobta` plugin is added to the store with the channel parameter set to 'my-store'. This will cause the store's state to be stored in session storage under the key 'my-store'. Whenever the store's state changes, the plugin will automatically update the value in session storage.

## Custom Codecs

As mentioned earlier, the plugin allows for the use of custom codecs. To use a custom codec, pass it as the codec parameter in the plugin configuration object. Here is an example of how to use a custom codec with the plugin:

```ts
import { mapYobta, localStoragePluginYobta, mapCodecYobta } from '@yobta/stores'

const store = mapYobta(
  { key: 'value' },
  sessionStoragePluginYobta({
    channel: 'my-map-store-yobta',
    codec: mapCodecYobta,
  }),
)
```

## See Also

- [Store Plugins](../index.md)
