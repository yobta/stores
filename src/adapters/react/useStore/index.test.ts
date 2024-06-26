import { renderHook, act } from '@testing-library/react'
import {
  renderHook as renderHookServer,
  act as actServer,
} from '@testing-library/react-hooks/server'

import { createStore } from '../../../stores/createStore/index.js'
import { useStore } from './index.js'

const unsubscribeMock = vi.fn()

vi.mock('../../../stores/createStore/index.js', () => ({
  createStore(initialState: any) {
    let state = initialState
    const observers: Set<() => void> = new Set()
    return {
      last: vi.fn().mockImplementation(() => state),
      next: vi.fn().mockImplementation((nextState: any) => {
        state = nextState
        for (const observer of observers) {
          observer()
        }
      }),
      observe: vi.fn().mockImplementation(observer => {
        observers.add(observer)
        return () => {
          observers.delete(observer)
          unsubscribeMock()
        }
      }),
    }
  },
}))

let store = createStore(1)

beforeEach(() => {
  store = createStore(1)
})

describe('client', () => {
  it('should return last state', () => {
    const { result } = renderHook(() => useStore(store))
    expect(result.current).toEqual(1)
  })
  it('should subscribe to store', () => {
    renderHook(() => useStore(store))
    expect(store.observe).toHaveBeenCalledOnce()
  })
  it('should unsubscribe from store', () => {
    const { unmount } = renderHook(() => useStore(store))
    unmount()
    expect(unsubscribeMock).toHaveBeenCalledOnce()
  })
  it('should handle store updates', () => {
    const { result, rerender } = renderHook(() => useStore(store))
    expect(result.current).toEqual(1)
    act(() => {
      store.next(2)
    })
    rerender()
    expect(result.current).toEqual(2)
  })
})

describe('server', () => {
  it('uses last as default getServerSnapshot', () => {
    const { result } = renderHookServer(() => useStore(store))
    expect(result.current).toBe(1)
  })
  it('returns serverState', () => {
    const { result } = renderHookServer(() => useStore(store, { serverState: 2 }))
    expect(result.current).toBe(2)
  })
  it('does not subscribe', () => {
    renderHookServer(() => useStore(store, { serverState: 2 }))
    expect(store.observe).not.toHaveBeenCalled()
  })
  it('does not unsubscribe', () => {
    const { unmount } = renderHookServer(() =>
      useStore(store, { serverState: 2 }),
    )
    unmount()
    expect(unsubscribeMock).not.toHaveBeenCalled()
  })
  it('does not call last', () => {
    renderHookServer(() => useStore(store, { serverState: 2 }))
    expect(store.last).not.toHaveBeenCalled()
  })
  it('does not handle store updates', () => {
    const { result } = renderHookServer(() => useStore(store, { serverState: 1 }))
    expect(result.current).toEqual(1)
    actServer(() => {
      store.next(2)
    })
    expect(store.last).toHaveBeenCalledTimes(0)
    expect(result.current).toEqual(1)
  })
  it('updates state when mounted', () => {
    renderHook(() => useStore(store, { serverState: 1 }))
    expect(store.next).toBeCalledWith(1)
    expect(store.next).toHaveBeenCalledTimes(1)
  })
  it('does not update state when rendered on server', () => {
    renderHookServer(() => useStore(store, { serverState: 1 }))
    expect(store.next).toHaveBeenCalledTimes(0)
  })
})
