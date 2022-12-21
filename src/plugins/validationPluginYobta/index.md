&larr; [Home](../../../README.md)

# Validation Plugin

Validates state between the store transitions.

###### example

```ts
const validate = (value: any): number => Number(value)

const counterStore = observableYobta(0, validationPluginYobta(validate))
```

## See Also

- [Store Plugins](../index.md)
