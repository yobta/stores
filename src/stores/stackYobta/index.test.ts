import { stackYobta } from './index.js'

let stack: ReturnType<typeof stackYobta>

beforeEach(() => {
  stack = stackYobta(['item1', 'item2'])
})

it('initial state', () => {
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(2)
})

it('adds new item, returns true', () => {
  expect(stack.add('item3')).toBe(true)
  expect(stack.last()).toBe('item3')
  expect(stack.size()).toBe(3)
})

it('adds nothing when item exists, returns false', () => {
  expect(stack.add('item2')).toBe(false)
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(2)
})

it('updates observers when adds', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.add('item3')
  expect(observer).toHaveBeenCalledWith(new Set(['item1', 'item2', 'item3']))
})

it('no updates when adding the existing items', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.add('item2')
  expect(observer).not.toHaveBeenCalled()
})

it('sends overloads to observers when adds', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.add('item3', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith(
    new Set(['item1', 'item2', 'item3']),
    'overload1',
    'overload2',
  )
})

it('reads last item', () => {
  expect(stack.last()).toBe('item1')
})

it('removes item, returns true', () => {
  expect(stack.remove('item2')).toBe(true)
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(1)
})

it('removes nothing if item does not exist, returns false', () => {
  expect(stack.remove('item3')).toBe(false)
  expect(stack.last()).toBe('item1')
  expect(stack.size()).toBe(2)
})

it('updates observers when removes', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.remove('item2')
  expect(observer).toHaveBeenCalledWith(new Set(['item1']))
})

it('no updates when removing items that no exist', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.remove('item3')
  expect(observer).not.toHaveBeenCalled()
})

it('sends overloads to observers when removes', () => {
  let observer = vi.fn()
  stack.observe(observer)
  stack.remove('item2', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledWith(
    new Set(['item1']),
    'overload1',
    'overload2',
  )
})

it('allows to check size of the store', () => {
  expect(stack.size()).toBe(2)
})
