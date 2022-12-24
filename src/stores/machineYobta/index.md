# Machine Store

`machineYobta` is a factory function that creates a state machine with a given set of transitions. The state machine can be used to track the current state of a process, and to set the next state based on the current state and a set of predefined transitions.

## Usage

To use `machineYobta`, first import it from the `@yobta/stores` package:

```ts
import { machineYobta } from '@yobta/stores'
```

Then, define the transitions between the states of the machine as an object. The keys of the object represent the starting states, and the values are sets of possible ending states.

```ts
const transitions = {
  idle: new Set(['loading', 'error']),
  loading: new Set(['success', 'error']),
  success: new Set(['idle']),
  error: new Set(['idle']),
}
```

Next, create the state machine by calling `machineYobta` with the transitions object and an initial state:

```ts
const machine = machineYobta(transitions)('idle')
```

The `machine` object returned by `machineYobta` has the following methods:

- `last`: Returns the current state of the machine.
- `next`: Sets the next state of the machine. If the provided state is not a valid transition from the current state, the state is not changed.
- `observe`: Registers an observer function to be called whenever the state of the machine changes. The observer function will be called with the new state as its argument.

## Example

Here is an example of using `machineYobta` to track the loading state of a data fetching process:

```ts
import { machineYobta } from '@yobta/stores'

const transitions = {
  idle: new Set(['loading', 'error']),
  loading: new Set(['success', 'error']),
  success: new Set(['idle']),
  error: new Set(['idle']),
}

const machine = machineYobta(transitions)('idle')

const fetchData = async () => {
  machine.next('loading')
  try {
    const data = await api.fetch()
    machine.next('success')
    return data
  } catch (error) {
    machine.next('error')
    throw error
  }
}

machine.observe(newState => {
  if (newState === 'loading') {
    showLoadingIndicator()
  } else {
    hideLoadingIndicator()
  }
})
```
