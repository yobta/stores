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

## See Also

- [Local Storage Plugin](./local-storage-plugin.md)
- [Store Plugins](./store-pligins.md)
