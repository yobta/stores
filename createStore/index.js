export function createStore(initialState) {
  let observers = []
  let state = initialState
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
      return () => {
        observers = observers.filter(
          currentObserver => currentObserver !== observer
        )
      }
    }
  }
}
