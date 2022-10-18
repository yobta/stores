&larr; [Home](../README.md)

# Broadcast Channel Plugin

The plugin helps share NEXT events between crosstab store instances.

The plugin ignores INIT and READY events by design which may result in an inconsistent initial state of the crosstab stores.

The plugin does not store the state between page reloads. If you need a persistent crosstab store, choose the Local Storage Plugin or implement your plugin.

###### example

```ts
const counterStore = observableYobta(
  0,
  broadcastChannelPluginYobta({ channel: 'yobta' }),
)
```

## See Also

- [Local Storage Plugin](./local-storage-plugin.md)
- [Store Plugins](./store-pligins.md)
