import { YobtaModalStore, createModalStore } from './index.js'

let stack: YobtaModalStore<string>

beforeEach(() => {
  stack = createModalStore(['item2', 'item1'])
})

it('returns a store object', () => {
  expect(stack).toEqual({
    add: expect.any(Function),
    last: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
    remove: expect.any(Function),
    size: expect.any(Function),
  })
})

it('initial state is undefined', () => {
  const s = createModalStore()
  expect(s.last()).toBeUndefined()
  expect(s.size()).toBe(0)
})

it('initial state is serial', () => {
  expect(stack.last()).toBe('item2')
  expect(stack.size()).toBe(2)
})

it('adds new item', () => {
  stack.add('item3')
  expect(stack.last()).toBe('item3')
  expect(stack.size()).toBe(3)
})

it('is readds item', () => {
  stack.add('item1')
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(2)
})

it('updates observers when adds', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.add('item3')
  expect(observer).toHaveBeenCalledWith('item3')
})

it('sends overloads to observers when adds', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.add('item3', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith('item3', 'overload1', 'overload2')
})

it('reads last item', () => {
  expect(stack.last()).toBe('item2')
})

it('removes top item, returns true', () => {
  expect(stack.remove('item2')).toBe(true)
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(1)
})

it('removes bottom item, returns true', () => {
  expect(stack.remove('item1')).toBe(true)
  expect(stack.last()).toBe('item2')
  expect(stack.size()).toBe(1)
})

it('removes nothing if item does not exist, returns false', () => {
  expect(stack.remove('item3')).toBe(false)
  expect(stack.last()).toBe('item2')
  expect(stack.size()).toBe(2)
})

it('updates observers when removes', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.remove('item2')
  expect(observer).toHaveBeenCalledWith('item1')
})

it('not updates when removing items that no exist', () => {
  const s = createModalStore()
  const observer = vi.fn()
  s.observe(observer)
  s.remove('item3')
  expect(observer).not.toHaveBeenCalled()
})

it('sends overloads to observers when removes', () => {
  const observer = vi.fn()
  stack.observe(observer)
  stack.remove('item1', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith('item2', 'overload1', 'overload2')
})

it('allows to check size of the store', () => {
  expect(stack.size()).toBe(2)
})
