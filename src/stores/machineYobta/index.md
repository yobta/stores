# Machine Store

A factory function for creating observable state machine stores with a given set of transitions. The state machine can be used to track the current state of a process, and to set the next state based on the current state and a set of predefined transitions.

## Usage

To use the `machineYobta` function, you will need to import it from the `@yobta/stores` package:

```ts
import { machineYobta } from '@yobta/stores'
```

Next, you will need to define a `transitions` object that specifies the allowed transitions between states. The keys of the object represent the possible states, and the values are arrays of allowed transition states. For example:

```ts
const transitions = {
  IDLE: ['LOADING'],
  LOADING: ['IDLE', 'ERROR'],
  ERROR: ['LOADING'],
}
```

With the `transitions` object defined, you can create a state machine store by calling `machineYobta` and passing in the transitions object. You will also need to specify an initial state for the store:

```ts
const machine = machineYobta(transitions)('IDLE')
```

## Setting State

To set the state of the state machine store, you can use the `next` function:

```ts
machine.next('LOADING')
```

## Reading STate

To read the current state of the state machine store, you can use the `last` function:

```ts
const state = machine.last()
```

## Observing Changes

You can observe changes to the state of the state machine store using the `observe` function. The `observe` function takes a callback function as an argument, which will be called every time the state of the store changes. The callback function will be passed the new state as an argument.

To stop observing changes, you can call the `stopObserving` function returned by the observe function:

```ts
const stopObserving = machine.observe(console.log)
stopObserving()
```

## Overloads

In addition to the state, you can also pass additional arguments to the `next` function when setting the state:

```ts
const machine = machineYobta(transitions)('IDLE')
machine.next('LOADING', 'some additional argument')
```

## Using With Typescript

Usually the store is able to infer the state from the transitions, but you may want to type the overloads.

```ts
type Overloads = [{ attempts: number }]
const machine = machineYobta(transitions)<Overloads>('IDLE')
machine.next('LOADING', { attempt: 2 })
```

## Plugins

The Machine store supports plugins in the same way that other stores do. For more information, see the [Plugins documentation](../../plugins/index.md).

## Subscribing to Store Events

The Machine store supports the same events as other stores. For more information, see the [Store documentation](../storeYobta/index.md).
