import { renderHook, act } from '@testing-library/react'
import {
  renderHook as renderHookServer,
  act as actServer,
} from '@testing-library/react-hooks/server'

import { storeYobta } from '../../../stores/storeYobta/index.js'
import { useYobta } from './index.js'

const unsubscribeMock = vi.fn()

vi.mock('../../../stores/storeYobta/index.js', () => ({
  storeYobta(initialState: any) {
    let state = initialState
    let observers: Set<() => void> = new Set()
    return {
      last: vi.fn().mockImplementation(() => state),
      next: vi.fn().mockImplementation((nextState: any) => {
        state = nextState
        for (let observer of observers) {
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

let store = storeYobta(1)

beforeEach(() => {
  store = storeYobta(1)
})

describe('client', () => {
  it('should return last state', () => {
    let { result } = renderHook(() => useYobta(store))
    expect(result.current).toEqual(1)
  })
  it('should subscribe to store', () => {
    renderHook(() => useYobta(store))
    expect(store.observe).toHaveBeenCalledOnce()
  })
  it('should unsubscribe from store', () => {
    let { unmount } = renderHook(() => useYobta(store))
    unmount()
    expect(unsubscribeMock).toHaveBeenCalledOnce()
  })
  it('should handle store updates', () => {
    let { result, rerender } = renderHook(() => useYobta(store))
    expect(result.current).toEqual(1)
    act(() => {
      store.next(2)
    })
    rerender()
    expect(result.current).toEqual(2)
  })
})

describe('server', () => {
  it('requires getServerSnapshot', () => {
    let { result } = renderHookServer(() => useYobta(store))
    expect(result.error).toEqual(expect.any(Error))
  })
  it('returns serverState', () => {
    let { result } = renderHookServer(() => useYobta(store, { serverState: 2 }))
    expect(result.current).toEqual(2)
  })
  it('returns getServerState()', () => {
    let { result } = renderHookServer(() =>
      useYobta(store, { getServerState: () => 2 }),
    )
    expect(result.current).toEqual(2)
  })
  it('does not subscribe', () => {
    renderHookServer(() => useYobta(store, { serverState: 2 }))
    expect(store.observe).not.toHaveBeenCalled()
  })
  it('does not unsubscribe', () => {
    let { unmount } = renderHookServer(() =>
      useYobta(store, { serverState: 2 }),
    )
    unmount()
    expect(unsubscribeMock).not.toHaveBeenCalled()
  })
  it('does not call last', () => {
    renderHookServer(() => useYobta(store, { serverState: 2 }))
    expect(store.last).not.toHaveBeenCalled()
  })
  it('does not handle store updates', () => {
    let { result } = renderHookServer(() => useYobta(store, { serverState: 1 }))
    expect(result.current).toEqual(1)
    actServer(() => {
      store.next(2)
    })
    expect(store.last).toHaveBeenCalledTimes(0)
    expect(result.current).toEqual(1)
  })
})
