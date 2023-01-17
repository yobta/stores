import { storeYobta } from '../../stores/storeYobta/index.js'
import { readableYobta } from './index.js'

it('returns a partial of the store', () => {
  let store = storeYobta(0)
  let readable = readableYobta(store)
  expect(readable).toEqual({
    last: expect.any(Function),
    observe: expect.any(Function),
  })
})
