import { YobtaStackStore, createStackStore } from './index.js'

let stack: YobtaStackStore<string>

beforeEach(() => {
  stack = createStackStore(['item1', 'item2'])
})

it('returns a store object', () => {
  expect(stack).toEqual({
    push: expect.any(Function),
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
    pop: expect.any(Function),
    size: expect.any(Function),
  })
})

it('initial state is undefined', () => {
  const s = createStackStore()
  expect(s.last()).toBeUndefined()
  expect(s.size()).toBe(0)
})

it('initial state is serial', () => {
  expect(stack.last()).toBe('item2')
  expect(stack.size()).toBe(2)
})

it('adds new item, returns true', () => {
  expect(stack.push('item3')).toBe(3)
  expect(stack.last()).toBe('item3')
  expect(stack.size()).toBe(3)
})

it('is not idempotent', () => {
  expect(stack.push('item2')).toBe(3)
  expect(stack.last()).toBe('item2')
  expect(stack.size()).toBe(3)
})

it('updates observers when adds', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.push('item3')
  expect(observer).toHaveBeenCalledWith('item3')
})

it('sends overloads to observers when adds', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.push('item3', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith('item3', 'overload1', 'overload2')
})

it('reads last item', () => {
  expect(stack.last()).toBe('item2')
})

it('removes item, returns removed', () => {
  expect(stack.pop()).toBe('item2')
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(1)
})

it('removes nothing if item does not exist, returns undefined', () => {
  const s = createStackStore()
  expect(s.pop()).toBeUndefined()
  expect(s.last()).toBeUndefined()
  expect(s.size()).toBe(0)
})

it('updates observers when removes', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.pop()
  expect(observer).toHaveBeenCalledWith('item1')
})

it('not updates when removing items that no exist', () => {
  const s = createStackStore()
  const observer = vi.fn()
  s.observe(observer)
  s.pop('item3')
  expect(observer).not.toHaveBeenCalled()
})

it('sends overloads to observers when removes', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.pop('overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith('item1', 'overload1', 'overload2')
})

it('allows to check size of the store', () => {
  expect(stack.size()).toBe(2)
})
