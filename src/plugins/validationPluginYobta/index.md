&larr; [Home](../../../README.md)

# Validation Plugin

The `validationPluginYobta` is a factory function that creates a plugin for [@yobta/stores](https://github.com/yobta/stores). This plugin can be used to validate the state of a store before it is updated.

The factory function takes a `validate` function as an argument, which should take an input of any type and return a state that is expected by the store. The `validate` function will be called every time the store's state is updated, and if it throws an error, the plugin will default to the store's initial state.

To use the plugin, you can pass it to the store as an overload when creating the store:

```ts
import { storeYobta, validationPluginYobta } from '@yobta/stores'

const initialState = {
  count: 0,
}

const validate = state => {
  if (typeof state.count !== 'number') {
    throw new Error('Invalid state: count must be a number')
  }
  return state
}

const store = storeYobta(initialState, validationPluginYobta(validate))
```

In this example, the `validate` function will be called every time the store's state is updated. If the `count` property of the new state is not a number, the plugin will throw an error and the store will revert to its initial state.

You can also use the `validationPluginYobta` factory function to create multiple validation plugins with different validate functions and pass them all to the store as overloads. This can be useful if you want to split up your validation logic into smaller, more reusable chunks.

```ts
import { storeYobta, validationPluginYobta } from '@yobta/stores'

const initialState = {
  count: 0,
  name: '',
}

const validateCount = state => {
  if (typeof state.count !== 'number') {
    throw new Error('Invalid state: count must be a number')
  }
  return state
}

const validateName = state => {
  if (typeof state.name !== 'string') {
    throw new Error('Invalid state: name must be a string')
  }
  return state
}

const store = createStore(
  initialState,
  validationPluginYobta(validateCount),
  validationPluginYobta(validateName),
)
```

In this example, the store will be validated by both the `validateCount` and `validateName` functions whenever its state is updated. If either function throws an error, the store will revert to its initial state.

## See Also

- [Store Plugins](../index.md)
