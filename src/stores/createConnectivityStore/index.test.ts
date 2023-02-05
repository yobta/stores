import { vi, expect } from 'vitest'

import { createConnectivityStore } from './index.js'

const addEventListener = vi.fn()
const removeEventListener = vi.fn()

vi.stubGlobal('window', {
  addEventListener,
  removeEventListener,
})
vi.stubGlobal('navigator', { onLine: true })

it('returns store object', () => {
  let store = createConnectivityStore()
  expect(store).toEqual({
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

it('is null when has no observers', () => {
  let store = createConnectivityStore()
  expect(store.last()).toBeNull()
})

it('is true when active and navigator is online', () => {
  let store = createConnectivityStore()
  let stop = store.observe(() => {})
  expect(store.last()).toBe(true)
  stop()
  expect(store.last()).toBeNull()
})

it('adds/remves window listeners', () => {
  let store = createConnectivityStore()
  let stop = store.observe(() => {})

  expect(addEventListener).toHaveBeenCalledTimes(2)
  expect(removeEventListener).toHaveBeenCalledTimes(0)
  expect(addEventListener.mock.calls[0][0]).toBe('online')
  expect(addEventListener.mock.calls[1][0]).toBe('offline')

  stop()

  expect(addEventListener).toHaveBeenCalledTimes(2)
  expect(removeEventListener).toHaveBeenCalledTimes(2)
  expect(addEventListener.mock.calls[0][0]).toBe('online')
  expect(addEventListener.mock.calls[1][0]).toBe('offline')
})

it('adds event listeners to window', () => {
  let observer = vi.fn()
  let store = createConnectivityStore()
  let stop = store.observe(observer)

  addEventListener.mock.calls[0][1]()
  expect(store.last()).toBe(true)
  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith(true)

  addEventListener.mock.calls[1][1]()
  expect(store.last()).toBe(false)
  expect(observer).toHaveBeenCalledTimes(2)
  expect(observer).toHaveBeenCalledWith(false)

  stop()
})
