import { renderHook } from '@testing-library/react'

import { createStore } from '../../../stores/createStore/index.js'
import { createHookFromStore } from './index.js'

const store = createStore(1)

it('returns a function', () => {
  const hook = createHookFromStore(store)
  expect(hook).toEqual(expect.any(Function))
})

it('renders hook and returns state', () => {
  const hook = createHookFromStore(store)
  const { result } = renderHook(hook)
  expect(result.current).toEqual(1)
})
