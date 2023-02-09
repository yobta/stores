import { YOBTA_IDLE, YOBTA_READY } from '../createStore/index.js'
import { createMachineStore } from './index.js'

it('creates store', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  expect(store).toEqual({
    last: expect.any(Function),
    next: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

it('has default state', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  expect(store.last()).toEqual('one')
})

it('sets next state', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  store.next('two')
  expect(store.last()).toEqual('two')
})

it('sends overloads to ubservers', () => {
  let observer = vi.fn()
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  let unsubscribe = store.observe(observer)
  store.next('two', 'overload1', 'overload2')
  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('two', 'overload1', 'overload2')
  unsubscribe()
})

it('sends overloads to middleware', () => {
  let middleware = vi.fn()
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })<[string, number]>('one', ({ addMiddleware }) => {
    addMiddleware('next', (state, ...overloads) => {
      middleware(state, ...overloads)
      return state
    })
  })
  store.next('two', 'overload1', 2)
  expect(middleware).toHaveBeenCalledTimes(1)
  expect(middleware).toHaveBeenCalledWith('two', 'overload1', 2)
})

it('ignores unexpected next state', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  store.next('three' as any)
  expect(store.last()).toEqual('one')
})

it('observes changes', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  let observer = vi.fn()
  let unobserve = store.observe(observer)
  store.next('two')
  expect(observer).toHaveBeenCalledTimes(1)
  expect(observer).toHaveBeenCalledWith('two')
  unobserve()
  store.next('one')
  expect(observer).toHaveBeenCalledTimes(1)
})

it('subscribes to ready event', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  let handler = vi.fn()
  let unsubscribe = store.on(YOBTA_READY, handler)
  expect(handler).toHaveBeenCalledTimes(0)
  let unobserve = store.observe(() => {})
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith('one')
  unsubscribe()
  unobserve()
})

it('subscribes to idle event', () => {
  let store = createMachineStore({
    one: ['two'],
    two: ['one'],
  })('one')
  let handler = vi.fn()
  let unsubscribe = store.on(YOBTA_IDLE, handler)
  let unobserve = store.observe(() => {})
  expect(handler).toHaveBeenCalledTimes(0)
  unobserve()
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith('one')
  unsubscribe()
})
