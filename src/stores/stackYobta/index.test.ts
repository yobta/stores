import { stackYobta } from './index.js'

it('is empty by default', () => {
  let store = stackYobta()

  expect(store.size()).toBe(0)
  expect(store.last()).toBeUndefined()
})

it('takes set as initial state', () => {
  let store = stackYobta(new Set([2, 1]))

  expect(store.size()).toBe(2)
  expect(store.last()).toBe(2)
})

it('takes array as initial state', () => {
  let store = stackYobta([2, 1])

  expect(store.size()).toBe(2)
  expect(store.last()).toBe(2)
})

it('adds', () => {
  let store = stackYobta()

  store.add(1)

  expect(store.size()).toBe(1)
  expect(store.last()).toBe(1)

  store.add(2)

  expect(store.size()).toBe(2)
  expect(store.last()).toBe(2)
})

it('is unique', () => {
  let store = stackYobta()

  store.add(1)
  store.add(1)

  expect(store.size()).toBe(1)
  expect(store.last()).toBe(1)
})

it('removes', () => {
  let store = stackYobta([2, 1])

  let result = store.remove(1)

  expect(result).toBe(true)
  expect(store.size()).toBe(1)
  expect(store.last()).toBe(2)

  result = store.remove(1)

  expect(result).toBe(false)
  expect(store.size()).toBe(1)
  expect(store.last()).toBe(2)

  result = store.remove(2)

  expect(result).toBe(true)
  expect(store.size()).toBe(0)
  expect(store.last()).toBeUndefined()
})

it('adds middleware', () => {
  let plugin1 = vi.fn()
  let plugin2 = vi.fn()
  let initialState = new Set([2, 1])
  stackYobta(initialState, plugin1, plugin2)

  expect(plugin1).toBeCalledWith({
    addMiddleware: expect.any(Function),
    initialState,
    last: expect.any(Function),
    next: expect.any(Function),
  })
})
