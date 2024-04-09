import { createPlainObjectStore, YobtaPlainObjectStore } from './index.js'

let store: YobtaPlainObjectStore<{ foo?: string; bar: string; baz?: never }>

beforeEach(() => {
  store = createPlainObjectStore({
    foo: 'foo',
    bar: 'bar',
  })
})

it('returns a store object', () => {
  expect(store).toEqual({
    assign: expect.any(Function),
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
    omit: expect.any(Function),
  })
})

it('creates a store with the correct initial state', () => {
  expect(store.last()).toEqual({
    foo: 'foo',
    bar: 'bar',
  })
})

it('registers listeners when they are added using `store.observe`', () => {
  const listener = vi.fn()
  store.observe(listener)
  store.assign({ foo: 'baz' })
  expect(listener).toHaveBeenCalledWith(
    { foo: 'baz', bar: 'bar' },
    { foo: 'baz' },
  )
})

it("updates the store's state and calls registered listeners with the correct arguments", () => {
  const listener = vi.fn()
  store.observe(listener)
  store.assign({ foo: 'baz' })
  expect(store.last()).toEqual({
    foo: 'baz',
    bar: 'bar',
  })
  expect(listener).toHaveBeenCalledWith(
    { foo: 'baz', bar: 'bar' },
    { foo: 'baz' },
  )
})

it('returns the correct state when `last` is called', () => {
  expect(store.last()).toEqual({
    foo: 'foo',
    bar: 'bar',
  })
})

it('registers an observer function and calls it with the correct arguments when the state is updated', () => {
  const observer = vi.fn()
  store.observe(observer)
  store.assign({ foo: 'baz' })
  expect(observer).toHaveBeenCalledWith(
    { foo: 'baz', bar: 'bar' },
    { foo: 'baz' },
  )
})

it("removes the specified keys from the store's state and calls registered listeners with the correct arguments", () => {
  const listener = vi.fn()
  store.observe(listener)
  store.omit(['foo'])
  expect(store.last()).toEqual({
    bar: 'bar',
  })
  expect(listener).toHaveBeenCalledWith({ bar: 'bar' }, ['foo'])
})

it('returns the correct changes when `assign` is called', () => {
  const changes = store.assign({ foo: 'baz' })
  expect(changes).toEqual({ foo: 'baz' })
})

it('returns the correct changes when `omit` is called', () => {
  const changes = store.omit(['foo'])
  expect(changes).toEqual(['foo'])
})

it('calls registered listeners with the correct overloads when `assign` is called', () => {
  const listener = vi.fn()
  store.observe(listener)
  store.assign({ foo: 'baz' }, 'overload1', 'overload2')
  expect(listener).toHaveBeenCalledWith(
    { foo: 'baz', bar: 'bar' },
    { foo: 'baz' },
    'overload1',
    'overload2',
  )
})

it('calls registered observers with the correct overloads when the state is updated', () => {
  const observer = vi.fn()
  store.observe(observer)
  store.assign({ foo: 'baz' }, 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith(
    { foo: 'baz', bar: 'bar' },
    { foo: 'baz' },
    'overload1',
    'overload2',
  )
})

it('calls registered listeners with the correct overloads when `omit` is called', () => {
  const listener = vi.fn()
  store.observe(listener)
  store.omit(['foo'], 'overload1', 'overload2')
  expect(listener).toHaveBeenCalledWith(
    { bar: 'bar' },
    ['foo'],
    'overload1',
    'overload2',
  )
})

it('does not call registered observers when `assign` is called with no changes', () => {
  const observer = vi.fn()
  store.observe(observer)
  store.assign({ foo: 'foo' })
  expect(observer).not.toHaveBeenCalled()
})

it('does not call registered listeners when `omit` is called with no changes', () => {
  const listener = vi.fn()
  store.observe(listener)
  store.omit(['baz'])
  expect(listener).not.toHaveBeenCalled()
})

it('returns an empty object when `assign` is called with no changes', () => {
  const changes = store.assign({ foo: 'foo' })
  expect(changes).toEqual({})
})

it('returns an empty array when `omit` is called with no changes', () => {
  const changes = store.omit(['baz'])
  expect(changes).toEqual([])
})
