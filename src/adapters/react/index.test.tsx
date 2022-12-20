import { renderHook } from '@testing-library/react'

import { useYobta } from './index.js'

const last = vi.fn(() => ({ foo: 'bar' }))
const unsubscribe = vi.fn()
const observe = vi.fn(() => unsubscribe)

const mockStore = {
  last,
  observe,
}

it('should return last state', () => {
  let { result } = renderHook(() => useYobta(mockStore))
  expect(result.current).toEqual({ foo: 'bar' })
})

it('should subscribe to store', () => {
  renderHook(() => useYobta(mockStore))
  expect(observe).toHaveBeenCalled()
})

it('should unsubscribe from store', () => {
  let { unmount } = renderHook(() => useYobta(mockStore))
  unmount()
  expect(unsubscribe).toHaveBeenCalled()
})

it('should handle store updates', () => {
  let { result, rerender } = renderHook(() => useYobta(mockStore))
  expect(last).toHaveBeenCalledTimes(2)
  expect(result.current).toEqual({ foo: 'bar' })

  // @ts-ignore
  let observer = observe.mock.calls[0][0] as (state: any) => void
  last.mockReturnValueOnce({ foo: 'baz' })
  observer({ foo: 'baz' })
  expect(last).toHaveBeenCalledTimes(2)

  rerender()
  expect(last).toHaveBeenCalledTimes(3)
  expect(result.current).toEqual({ foo: 'baz' })
})
