&larr; [Home](../../../README.md)

# Broadcast Channel Plugin

A plugin for [@yobta/stores](https://www.npmjs.com/package/@yobta/stores) that allows them to receive state updates from other instances of the same store using the browser's [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).

It is important to note that this plugin does not persist state, meaning that stores may have different initial states.

Updates are only received by the plugin when the store has subscribers.

## Usage

```ts
import { createStore, broadcastChannelPlugin } from '@yobta/stores'

const store = createStore(
  { count: 0 },
  broadcastChannelPlugin({ channel: 'my-store' }),
)
```

## Arguments

The plugin factory function accepts an object with the following properties:

- `channel` (string) — The name of the channel.
- `codec` (YobtaCodec, optional) The codec to use for serializing and deserializing the state. Defaults to `codecYobta`.

## Codec

The default codec provided by plugin is able to decode simple values such as numbers, strings, and booleans, as well as arrays and plain objects. However, for more complex data structures like maps and sets, a special codec may be required to properly serialize and deserialize the state. This can be done by specifying an codec function as an optional argument when creating the `broadcastChannelPlugin` instance. The codec function should be able to handle the serialization and deserialization of the desired data structure, allowing the store to properly synchronize via the broadcastChannel.

```ts
import {
  createMapStore,
  broadcastChannelPlugin,
  mapCodecYobta,
} from '@yobta/stores'

const store = createMapStore(
  { key: 'value' },
  broadcastChannelPlugin({
    channel: 'my-map-store-yobta',
    codec: mapCodecYobta,
  }),
)
```

## See Also

- [Local Storage Plugin](../localStoragePlugin/index.md)
- [Store Plugins](../index.md)
