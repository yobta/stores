&larr; [Home](../../README.md)

# Store Plugins

Store plugins allow you to extend stores by adding middlewares. A store plugin is a function that takes an object with the following properties:

- `addMiddleware`: A function that can be used to add middleware to the store. The middleware function should always return the state of the store.
- `initialState`: The initial state of the store.
- `next`: A function that can be used to update the state of the store.
- `last`: A function that returns the current state of the store.

## Example

This plugin logs the state of the store whenever it is updated:

```ts
const loggerPlugin: YobtaStorePlugin<number> = ({ addMiddleware }) => {
  // Add middleware for each state transition
  addMiddleware('ready', state => {
    console.log('ready state:', state)
    return state
  })
  addMiddleware('idle', state => {
    console.log('idle state:', state)
    return state
  })
  addMiddleware('next', state => {
    console.log('next state:', state)
    return state
  })
}
const store = yobtaStore(0, loggerPlugin)
```

## Composition of Middlewares

In the above example, the middlewares return a state. When multiple plugins are added, their middlewares are composed in a way that each middleware receives the state of the middleware that comes immediately after it. The value returned by the first middleware in the chain will become the new state of the store.

It is important to note that the order in which the middlewares are composed matters. The state will be passed through each middleware in the order they are composed, and the final state of the store will be determined by the value returned by the first middleware in the chain. Make sure to consider the order of your middlewares when setting up your store.

## Overloading the `next` Method

You may already know that the next method of a store allows for overloads. These overloads do not affect the store's logic, but rather allow you to send metadata to your plugins.

For example, you can use the next method to log metadata to the console:

```ts
const loggerPlugin: YobtaStorePlugin<number> = ({ addMiddleware }) => {
  addMiddleware('next', (state, ...overloads) => {
    console.log(
      'next called with state:',
      state,
      'and overloads:',
      ...overloads,
    )
    return state
  })
}
const store = yobtaStore(0, loggerPlugin)
store.next(store.last() + 1, 'add', '1')
```

## Updating the Store with Plugins

In this example, we will create a plugin that helps us to observe the online state of the browser. It will update the store's state each time the browser's online state changes, but only when the store has observers (is in the active state).

```ts
const onlineStatePlugin: YobtaStorePlugin<number> = ({
  addMiddleware,
  initialState,
  next,
}) => {
  // create event handlers to set the state to online or offline
  const setOnline: VoidFunction = () => {
    next(true)
  }
  const setOffline: VoidFunction = () => {
    next(false)
  }

  // add middlewares to handle the 'ready' and 'idle' events
  addMiddleware('ready', state => {
    // attach event listeners to the window object
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    // return the current online state as determined by the navigator object
    return navigator.onLine
  })
  addMiddleware('idle', state => {
    // remove event listeners from the window object
    window.removeEventListener('online', setOnline)
    window.removeEventListener('offline', setOffline)

    // return the initial state when the store is idle
    return initialState
  })
}

// create a store with the onlineStatePlugin
const store = yobtaStore<boolean | null>(null, onlineStatePlugin)
```

## Store Events

In this document, we have mentioned three types of store events:

- `ready` – fired when the first observer is added to the store.
- `idle` – fired when the last observer leaves the store.
- `next` – fired each time the state of the store is changed.

These events can be useful for triggering certain actions or behavior in your application. For example:

- The `ready` event can be used to set up event listeners or perform initialization tasks.
- The `idle` event can be used to clean up resources or remove event listeners.
- The `next` event can be used to validate the state, replicate or persist the state, or perform any other tasks that need to be run in response to a state change.

By adding middlewares to these events, you can customize the behavior of the store whenever the corresponding event is fired. This allows you to implement features such as state validation, replication, or persistence in your application.
