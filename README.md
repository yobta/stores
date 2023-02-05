# Yobta Stores

A collection of tiny, observable stores designed to move logic away from components and help write reactive applications. These stores are:

- **Small** in size.
- **Tree-shakable** for optimal performance.
- **Zero dependencies**, so you don't have to worry about other libraries affecting your code.
- **ESM-only**, meaning they are compatible with ECMAScript Modules.
- **Typescript** compatible.

## Installation

To install Yobta Stores, use the following command:

```bash
npm i @yobta/stores
```

## Documentation

The following sections provide documentation on different parts of Yobta Stores:

### Stores

- [Basic](src/stores/createStore/index.md) - A general observable store for implementing any custom logic you need.
- [Machine](src/stores/createMachineStore/index.md) - A simple observable state machine.
- [Map](src/stores/createMapStore/index.md) - An observable Map object.
- [Online](src/stores/createConnectivityStore/index.md) - Tracks the browser's connectivity state.
- [Plain Object](src/stores/createPlainObjectStore/index.md) - An observable plain object.
- [Stack](src/stores/createStackStore/index.md) - An observable stack object.
- [Derived](src/stores/createDerivedStore/index.md) - Aggregates data from one or multiple stores.

### Plugins

- [About Plugins](src/plugins/index.md) - Basic information about plugins and middleware.
- [Broadcast Channel](src/plugins/broadcastChannelPlugin/index.md) - Syncs state between browsing contexts.
- [Lazy](src/plugins/lazyPlugin/index.md) - Resets the store to its initial state when idle.
- [Local Storage](src/plugins/localStoragePlugin/index.md) - Persists and replicates state.
- [Session Storage](src/plugins/sessionStoragePluginYobta/index.md) - Persists the store in one browsing context.
- [Validation](src/plugins/validationPluginYobta/index.md) - Protects state.

### Adapters

- [Using with React](src/adapters/react/useStore/index.md) - A store hook for React.
- [Hook Factory](src/adapters/react/createHookFromStore/index.md) - Makes React hooks from stores.

### Utilities

- [Codec](src/util/codecYobta/index.md) - Encodes/decodes objects to/from JSON.
- [Compose](src/util/composeYobta/index.md) - Composes many functions into one.
- [Map Diff](src/util/diffMapYobta/index.md) - Compares Map objects.
- [Object Diff](src/util/diffObjectYobta/index.md) - Compares plain objects.
- [Map Codec](src/util/mapCodecYobta/index.md) - Encodes/decodes Maps to/from JSON.
- [Observable](src/util/observableYobta/ind) - Creates an observable object.
- [PubSub](src/util/pubSubYobta/index.md) - Creates PubSub objects.
- [Readable Store](src/util/readableYobta/index.md) — Creates a read-only version of the store.
- [Set Codec](src/util/setCodecYobta/index.md) - Encodes/decodes Sets to/from JSON.
- [Store Effect Utility](src/util/storeEffectYobta/index.md) — Adds ready/idle callbacks.
- [Transition Effect Utility](src/util/transitionEffectYobta/index.md) — Add state transition callback.

Kudos:

- [`Andrey Sitnik`] — nanostores and the package boilerplate

[`andrey sitnik`]: https://sitnik.ru
