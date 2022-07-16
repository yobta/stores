&larr; [Home](../../README.md)

# Store Plugins

Plugins are the functions that can listen store lifesycle events, read and modify store state. You can add any number of plugins to the stores.

A store emits following types of events to the plugins:

- **INIT** — before a store adds first observer
- **READY** — after a store adds first observer
- **NEXT** — on every store update
- **IDLE** — when a store removes last observer

Each type of the store events has `initialState` reference and `next()` and `last()` methods.

## Plugin Interface

```ts
interface StorePlugin<State> {
  (event: {
    initialState: State
    last(): State
    next(action: State | ((last: State) => State), ...args: any[]): void
    type: 'INIT' | 'READY' | 'IDLE' | 'NEXT'
  }): void
}
```

## Creating Plugins

Let's create a plugin that squares the value of any numeric store on every update.
