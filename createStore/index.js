export function createStore(initialState) {
  let state = initialState
  let observers = []
  function unsubscribe(observer) {
    observers = observers.filter(
      currentObserver => currentObserver !== observer
    )
  }
  return {
    add(observer) {
      observers.push(observer)
      return () => unsubscribe(observer)
    },
    getState() {
      return state
    },
    setState(nextState) {
      state = nextState
      observers.forEach(o => o(state))
    },
    reset() {
      observers.forEach(unsubscribe)
      state = initialState
    }
  }
}
