export function createTransition(store, transition) {
  return action => {
    let nextState = transition(store.getState(), action)
    store.setState(nextState)
  }
}
