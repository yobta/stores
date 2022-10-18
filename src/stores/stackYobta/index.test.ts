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

it('takes arrya as initial state', () => {
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
