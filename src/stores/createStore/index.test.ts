import { expect, vi, it } from 'vitest'

import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  createStore,
  YOBTA_READY,
  YobtaStoreEvent,
  YobtaStoreMiddleware,
  YOBTA_BEFORE,
} from './index.js'

const pluginMock = vi.fn()
const observerMock = vi.fn()
const observerMock1 = vi.fn()

const addMiddlewareSpy = vi.fn<
  [YobtaStoreEvent, YobtaStoreMiddleware<number, any>],
  void
>()

const handlersSpy = {
  [YOBTA_IDLE]: vi.fn(),
  [YOBTA_READY]: vi.fn(),
  [YOBTA_NEXT]: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  addMiddlewareSpy.mockImplementation((type, handler) => {
    handlersSpy[type].mockImplementation(handler)
  })
  pluginMock.mockImplementation(({ addMiddleware }) => {
    addMiddleware(
      YOBTA_READY,
      handlersSpy[YOBTA_READY].mockImplementation(state => state),
    )
    addMiddleware(
      YOBTA_NEXT,
      handlersSpy[YOBTA_NEXT].mockImplementation(state => state),
    )
    addMiddleware(
      YOBTA_IDLE,
      handlersSpy[YOBTA_IDLE].mockImplementation(state => state),
    )
  })
})

it('returnes a store object', () => {
  const store = createStore(1)
  expect(store).toEqual({
    last: expect.any(Function),
    next: expect.any(Function),
    observe: expect.any(Function),
    on: expect.any(Function),
  })
})

it('Sets default state on store creation', () => {
  const store = createStore(1, pluginMock)
  expect(store.last()).toBe(1)
})

it('Updates store state when not observed', () => {
  const store = createStore(1)
  store.next(2)
  expect(store.last()).toBe(2)
})

it('Triggers YOBTA_NEXT event on plugin when not observed', () => {
  const store = createStore(1, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
})

it('Triggers events on all registered plugins', () => {
  const store = createStore(1, pluginMock, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(2)
})

it('Does not trigger observer callback on subscription', () => {
  const store = createStore(1)
  const unsubscribe = store.observe(observerMock)
  expect(observerMock).toHaveBeenCalledTimes(0)
  unsubscribe()
})

it('Does not trigger observer callback on unsubscription', () => {
  const store = createStore(1)
  const unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
})

it('Triggers YOBTA_IDLE event on plugin when last observer is removed', () => {
  const store = createStore(1, pluginMock)
  const unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledWith(1)
})

it('allows observers to read last state', () => {
  const store = createStore(1)
  const unsubscribe = store.observe(state => {
    expect(state).toBe(2)
  })
  store.next(2)
  unsubscribe()
})

it('Does not trigger YOBTA_IDLE event on plugin when observers are present', () => {
  const store = createStore(1, pluginMock)
  const unsubscribe = store.observe(observerMock)
  const unsubscribe2 = store.observe(observerMock1)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledTimes(0)
  unsubscribe2()
})

it('Sends YOBTA_READY event to plugins when observer is added', () => {
  const store = createStore(1, pluginMock)
  const unsubscribe = store.observe(observerMock)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_READY]).toHaveBeenCalledWith(1)
  unsubscribe()
})

it('Sending YOBTA_NEXT event to plugins and observers', () => {
  const store = createStore(1, pluginMock)
  const unsubscribe = store.observe(observerMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  expect(observerMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('Sends overloads to observers', () => {
  const store = createStore(1)
  const unsubscribe = store.observe(observerMock)
  const overload = Array.from('overload')
  store.next(1, ...overload)
  unsubscribe()
})

it('Retends state after termination', () => {
  const store = createStore(1)
  const unsubscribe = store.observe(observerMock)
  store.next(1)
  unsubscribe()
  store.next(2)
  expect(store.last()).toBe(2)
})

it('Has unique observers', () => {
  const store = createStore(1)
  const terminate1 = store.observe(observerMock)
  const terminate2 = store.observe(observerMock)
  store.next(1)
  expect(observerMock).toHaveBeenCalledTimes(1)
  terminate1()
  store.next(2)
  expect(observerMock).toHaveBeenCalledTimes(2)
  terminate2()
  store.next(3)
  expect(observerMock).toHaveBeenCalledTimes(2)
})

it('Compose middlewares', () => {
  const mock1 = vi.fn()
  const mock2 = vi.fn()
  const store = createStore(
    1,
    ({ addMiddleware }) => {
      addMiddleware(YOBTA_NEXT, state => {
        mock1(state)
        return 1
      })
    },
    ({ addMiddleware }) => {
      addMiddleware(YOBTA_NEXT, state => {
        mock2(state)
        return 2
      })
    },
  )
  store.next(3)
  expect(mock1).toHaveBeenCalledWith(2)
  expect(mock2).toHaveBeenCalledWith(3)
})

it('subscribes to ready event', () => {
  const store = createStore(1)
  const readyMock = vi.fn()
  const unsubscribe = store.on(YOBTA_READY, readyMock)
  const unobserve = store.observe(vi.fn())
  expect(readyMock).toHaveBeenCalledTimes(1)
  expect(readyMock).toHaveBeenCalledWith(1)
  unsubscribe()
  unobserve()
  expect(readyMock).toHaveBeenCalledTimes(1)
})

it('subscribes to idle event', () => {
  const store = createStore(1)
  const idleMock = vi.fn()
  const unsubscribe = store.on(YOBTA_IDLE, idleMock)
  const unobserve = store.observe(vi.fn())
  expect(idleMock).toHaveBeenCalledTimes(0)
  unobserve()
  unsubscribe()
  expect(idleMock).toHaveBeenCalledTimes(1)
  expect(idleMock).toHaveBeenCalledWith(1)
})

it('emits beforeUpdate on ready when state is not changed by the middleware', () => {
  const store = createStore(1)
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  const unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
})

it('emits beforeUpdate on ready when state is changed by the middleware', () => {
  const store = createStore(1, ({ addMiddleware }) => {
    addMiddleware(YOBTA_READY, state => state + 1)
  })
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  const unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(2)
  unobserve()
  unsubscribe()
})

it('emits beforeUpdate on ready when state is not changed by next', () => {
  const store = createStore(1)
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  store.next(1)
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unsubscribe()
})
it('emits beforeUpdate on ready when state is changed by next', () => {
  const store = createStore(1)
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  store.next(2)
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('emits beforeUpdate on idle when state is not changed by the middleware', () => {
  const store = createStore(1)
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  const unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
  expect(transitionMock).toHaveBeenCalledTimes(2)
  expect(transitionMock).toHaveBeenCalledWith(1)
})

it('emits beforeUpdate on idle when state is changed by the middleware', () => {
  const store = createStore(1, ({ addMiddleware }) => {
    addMiddleware(YOBTA_IDLE, state => {
      return state + 1
    })
  })
  const transitionMock = vi.fn()
  const unsubscribe = store.on(YOBTA_BEFORE, transitionMock)
  const unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
  expect(transitionMock).toHaveBeenCalledTimes(2)
  expect(transitionMock).toHaveBeenCalledWith(2)
})
