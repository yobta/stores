import { createStore } from '../createStore/index.js'
import { createProjection } from '../index.js'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const waitRAF = () => new Promise(resolve => requestAnimationFrame(resolve))

it('creates', () => {
  let store1 = createStore(1)
  let store2 = createStore(2)
  let projection = createProjection(
    (state1, state2) => {
      return state1 + state2
    },
    store1,
    store2
  )
  let state = projection.last()
  expect(state).toBe(3)
})

it('updates', async () => {
  let store1 = createStore(1)
  let store2 = createStore(2)
  let projection = createProjection(
    (state1, state2) => {
      return state1 + state2
    },
    store1,
    store2
  )
  store1.next(0)
  store2.next(0)
  await waitRAF()
  let state = projection.last()
  expect(state).toBe(0)
})
