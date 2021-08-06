export function createStore(initialState) {
  let observers = []
  let state = initialState
  function unsubscribe(observer) {
    observers = observers.filter(
      currentObserver => currentObserver !== observer
    )
  }
  return {
    last() {
      return state
    },
    next(...args) {
      state = args[0]
      observers.forEach(observe => observe(...args))
    },
    observe(observer) {
      observers.push(observer)
      return () => unsubscribe(observer)
    },
    reset() {
      observers.forEach(unsubscribe)
      state = initialState
    }
  }
}
