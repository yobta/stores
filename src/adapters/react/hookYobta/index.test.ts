import { renderHook } from '@testing-library/react'

import { createStore } from '../../../stores/createStore/index.js'
import { hookYobta } from './index.js'

const store = createStore(1)

it('returns a function', () => {
  let hook = hookYobta(store)
  expect(hook).toEqual(expect.any(Function))
})

it('renders hook and returns state', () => {
  let hook = hookYobta(store)
  let { result } = renderHook(hook)
  expect(result.current).toEqual(1)
})
