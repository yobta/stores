&larr; [Home](../../../README.md)

# Map Store

!Map store is mutable. If you need an immutable store consider using [plain object store](./plain-object-store.md)

## Creating the store

The constructor creates map from a plain object that you need to pass as initial state.
The state type is inferred from that state by default.

```ts
import { mapYobta } from '@yobta/stores'

const mapStore = mapYobta({ key: 'value' })

// you can change the existing value
mapStore.assign({ key: 'new value' })

// but you can not add the key that is not in the type
mapStore.assign({ optionalKey: 'another value' })

// you can not omit 'key' because it's not optional
mapStore.omit(['key'])

const map = mapStore.last() // will return Map<{ key: string }>
```

## Strict Types

```ts
import { mapYobta } from '@yobta/stores'

type State = { key: string; optionalKey?: string }

const mapStore = mapYobta<State>({ key: 'value' })

// now you can assign optional key
mapStore.assign({
  key: 'value 1',
  optionalKey: 'value 2',
})

// omit will accept only the optional keys:
mapStore.omit(['optionalKey'])

// and the required keys are still protected:
mapStore.omit(['key'])
```

## Persistency

Map state reqires a special ecoder when used with the plugins that serialize state.

### With [LS](../../plugins/lazyPluginYobta/index.md) Plugin

```ts
import { mapYobta, mapCodecYobta, localStoragePluginYobta } from '@yobta/stores'

const mapStore = mapYobta<State>(
  { key: 'value' },
  localStoragePluginYobta({
    channel: 'yobta',
    codec: mapCodecYobta,
  }),
)
```

### With [SS](../../plugins/sessionStoragePluginYobta/index.md) Plugin

```ts
import {
  mapYobta,
  mapCodecYobta,
  sessionStoragePluginYobta,
} from '@yobta/stores'

const mapStore = mapYobta<State>(
  { key: 'value' },
  sessionStoragePluginYobta({
    channel: 'yobta',
    codec: mapCodecYobta,
  }),
)
```

### With [BC](../../plugins/broadcastChannelPluginYobta/index.md) Plugin

```ts
import {
  mapYobta,
  mapCodecYobta,
  broadcastChannelPluginYobta,
} from '@yobta/stores'

const mapStore = mapYobta<State>(
  { key: 'value' },
  broadcastChannelPluginYobta({
    channel: 'yobta',
    codec: mapCodecYobta,
  }),
)
```
