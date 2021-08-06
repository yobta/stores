import { createStore } from '../createStore/index.js'
import { createTransition } from './index.js'

let store = createStore(0)

it('transitions', () => {
  let increment = createTransition(store, (prevState, by: number) => {
    return prevState + by
  })
  increment(1)
  increment(2)
  let state = store.last()
  expect(state).toBe(3)
})
