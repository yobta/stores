&larr; [Home](../README.md)

# Broadcast Channel Plugin

A plugin for [@yobta/stores](https://www.npmjs.com/package/@yobta/stores) that allows them synchronize their states with other instances of the same store using the browser's [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).

It is important to note that this plugin does not persist state, meaning that stores may have different initial states.

Updates are only received by the plugin when the store has subscribers.

## Usage

```ts
import { storeYobta, broadcastChannelPluginYobta } from '@yobta/stores'

const store = storeYobta(
  { count: 0 },
  broadcastChannelPluginYobta({ channel: 'my-store' }),
)
```

## Arguments

The plugin factory function accepts an object with the following properties:

- `channel` (string) — The name of the channel.
- `codec` (YobtaCodec, optional) The codec to use for serializing and deserializing the state. Defaults to `codecYobta`.

## Codec

The default codec provided by plugin is able to decode simple values such as numbers, strings, and booleans, as well as arrays and plain objects. However, for more complex data structures like maps and sets, a special codec may be required to properly serialize and deserialize the state. This can be done by specifying an codec function as an optional argument when creating the `broadcastChannelPluginYobta` instance. The codec function should be able to handle the serialization and deserialization of the desired data structure, allowing the store to properly synchronize via the broadcastChannel.

```ts
import {
  mapYobta,
  broadcastChannelPluginYobta,
  mapCodecYobta,
} from '@yobta/stores'

const store = mapYobta(
  { key: 'value' },
  broadcastChannelPluginYobta({
    channel: 'my-map-store-yobta',
    ecoder: mapCodecYobta,
  }),
)
```

## See Also

- [Local Storage Plugin](./local-storage-plugin.md)
- [Store Plugins](./store-pligins.md)
