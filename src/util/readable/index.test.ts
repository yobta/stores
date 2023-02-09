import { createStore } from '../../stores/createStore/index.js'
import { readable } from './index.js'

it('returns a partial of the store', () => {
  let store = createStore(0)
  let readableStore = readable(store)
  expect(readableStore).toEqual({
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})
