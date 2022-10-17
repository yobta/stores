&larr; [Home](../README.md)

# Local Storage Plugin

The plugin helps persist the store state between page reloads.

The plugin activates on the store READY event, which means that the store is in an initial state unless the first observer is added.

###### example

```ts
const counterStore = observableYobta(
  0,
  sessionStoragePluginYobta({ channel: 'yobta' }),
)
```

## See Also

- [Store Plugins](./store-pligins.md)
