import { createStore } from '../createStore/index.js'
import { createTransition } from './index.js'

it('transitions', () => {
  let store = createStore(0)
  let increment = createTransition(store, (prevState, by: number) => {
    return prevState + by
  })
  increment(1)
  increment(2)
  expect(store.getState()).toBe(3)
})
