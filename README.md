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

- [Observable](src/stores/storeYobta/index.md)
- [Machine](src/stores/machineYobta/index.md)
- [Map](src/stores/mapYobta/index.md)
- Plain Object
- Stack

### Plugins

- [Broadcast Channel](src/plugins/broadcastChannelPluginYobta/index.md)
- [Lazy](src/plugins/lazy-plugin/index.md)
- [Local Storage](src/plugins/local-storage-plugin/index.md)
- [Session Storage](src/plugins/session-storage-plugin/index.md)
- [Validation](src/plugins/validation-plugin/index.md)

### Utilities

- Codec
- [Compose](src/util/composeYobta/index.md)
- Map Codec
- [PubSub](src/util/pubSubYobta/index.md)

### Recipes

- Lazy Boolean Store
- Replicating to URL Search Params

Kudos:

- [`Andrey Sitnik`] — nanostores and the boilerplate

[`andrey sitnik`]: https://sitnik.ru
