export function createTransition(store, transition) {
  return (...args) => {
    let state = transition(store.last(), ...args)
    store.next(state, ...args)
  }
}
