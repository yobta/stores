# Yobta Stores

A collection of tiny observable stores designed to move logic away from components and help write reactive applications.

- **Small**. 189–700 Bytes, zero dependencies
- **Tree-shakable**.
- **ESM-only**.
- **Typescript**.

## Istallation

```
npm i @yobta/stores
```

## Documentation

### Key Concepts

- [Using with React](src/adapters/react/index.md)
- [Store Plugins](src/plugins/index.md)

### Stores

- [Observable Store](src/stores/storeYobta/index.md)
- [Machine Store](src/stores/machineYobta/index.md)
- [Map Store](src/stores/mapYobta/index.md)
- Plain Object Store
- Stack Store

### Plugins

- [Broadcast Channel Plugin](src/plugins/broadcastChannelPluginYobta/index.md)
- [Lazy Plugin](src/plugins/lazy-plugin/index.md)
- [Local Storage Plugin](src/plugins/local-storage-plugin/index.md)
- [Session Storage Plugin](src/plugins/session-storage-plugin/index.md)
- [Validation Plugin](src/plugins/validation-plugin/index.md)

### Utilities

- Codec Utility
- Map Codec Utility
- [PubSub Utility](src/util/pubSubYobta/index.md)

### Recipes

- Lazy Boolean Store
- Replicating to URL Search Params

Kudos:

- [`Andrey Sitnik`] — nanostores and the boilerplate

[`andrey sitnik`]: https://sitnik.ru
