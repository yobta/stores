import { createStore } from '../createStore/index.js'

export function createProjection(cb, ...stores) {
  let timeout
  let reduce = () => cb(...stores.map(store => store.last()))
  let { last, next, observe } = createStore(reduce())
  function update() {
    if (timeout) window.cancelAnimationFrame(timeout)
    timeout = window.requestAnimationFrame(() => {
      let state = reduce()
      next(state)
    })
  }
  stores.forEach(store => store.observe(update))
  return { last, observe }
}
