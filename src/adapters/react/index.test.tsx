import { renderHook, act } from '@testing-library/react'

import { storeYobta } from '../../stores/storeYobta/index.js'
import { useYobta } from './index.js'

const unsubscribeMock = vi.fn()

vi.mock('../../stores/storeYobta/index.js', () => ({
  storeYobta(initialState: any) {
    let state = initialState
    return {
      last: vi.fn().mockImplementation(() => state),
      next: vi.fn().mockImplementation((nextState: any) => {
        state = nextState
      }),
      observe: vi.fn().mockImplementation(() => unsubscribeMock),
    }
  },
}))

let store = storeYobta(1)

beforeEach(() => {
  store = storeYobta(1)
})

it('should return last state', () => {
  let { result } = renderHook(() => useYobta(store))
  expect(result.current).toEqual(1)
})

it('should subscribe to store', () => {
  renderHook(() => useYobta(store))
  expect(store.observe).toHaveBeenCalled()
})

it('should unsubscribe from store', () => {
  let { unmount } = renderHook(() => useYobta(store))
  unmount()
  expect(unsubscribeMock).toHaveBeenCalled()
})

it('should handle store updates', () => {
  let { result, rerender } = renderHook(() => useYobta(store))
  expect(store.last).toHaveBeenCalledTimes(2)
  expect(result.current).toEqual(1)
  act(() => {
    store.next(2)
  })
  expect(store.last).toHaveBeenCalledTimes(2)
  rerender()
  expect(store.last).toHaveBeenCalledTimes(3)
  expect(result.current).toEqual(2)
})
