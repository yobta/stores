import { expect, vi, it } from 'vitest'

import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  storeYobta,
  YOBTA_READY,
  YobtaStoreEvent,
  YobtaStoreMiddleware,
} from './index.js'

const pluginMock = vi.fn()
const observerMock = vi.fn()
const observerMock1 = vi.fn()

let addMiddlewareSpy = vi.fn<
  [YobtaStoreEvent, YobtaStoreMiddleware<number, any>],
  void
>()

let handlersSpy = {
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
  let store = storeYobta(1)
  expect(store).toEqual({
    last: expect.any(Function),
    next: expect.any(Function),
    observe: expect.any(Function),
    onReady: expect.any(Function),
    onIdle: expect.any(Function),
    onBeforeUpdate: expect.any(Function),
  })
})

it('Sets default state on store creation', () => {
  let store = storeYobta(1, pluginMock)
  expect(store.last()).toBe(1)
})

it('Updates store state when not observed', () => {
  let store = storeYobta(1)
  store.next(2)
  expect(store.last()).toBe(2)
})

it('Triggers YOBTA_NEXT event on plugin when not observed', () => {
  let store = storeYobta(1, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
})

it('Triggers events on all registered plugins', () => {
  let store = storeYobta(1, pluginMock, pluginMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(2)
})

it('Does not trigger observer callback on subscription', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  expect(observerMock).toHaveBeenCalledTimes(0)
  unsubscribe()
})

it('Does not trigger observer callback on unsubscription', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
})

it('Triggers YOBTA_IDLE event on plugin when last observer is removed', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledWith(1)
})

it('allows observers to read last state', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(state => {
    expect(state).toBe(2)
  })
  store.next(2)
  unsubscribe()
})

it('Does not trigger YOBTA_IDLE event on plugin when observers are present', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  let unsubscribe2 = store.observe(observerMock1)
  unsubscribe()
  expect(observerMock).toHaveBeenCalledTimes(0)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_IDLE]).toHaveBeenCalledTimes(0)
  unsubscribe2()
})

it('Sends YOBTA_READY event to plugins when observer is added', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_READY]).toHaveBeenCalledWith(1)
  unsubscribe()
})

it('Sending YOBTA_NEXT event to plugins and observers', () => {
  let store = storeYobta(1, pluginMock)
  let unsubscribe = store.observe(observerMock)
  store.next(2)
  expect(pluginMock).toHaveBeenCalledTimes(1)
  expect(handlersSpy[YOBTA_NEXT]).toHaveBeenCalledWith(2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  expect(observerMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('Sends overloads to observers', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  let overload = Array.from('overload')
  store.next(1, ...overload)
  unsubscribe()
})

it('Retends state after termination', () => {
  let store = storeYobta(1)
  let unsubscribe = store.observe(observerMock)
  store.next(1)
  unsubscribe()
  store.next(2)
  expect(store.last()).toBe(2)
})

it('Has unique observers', () => {
  let store = storeYobta(1)
  let terminate1 = store.observe(observerMock)
  let terminate2 = store.observe(observerMock)
  store.next(1)
  expect(observerMock).toHaveBeenCalledTimes(1)
  terminate1()
  store.next(2)
  expect(observerMock).toHaveBeenCalledTimes(1)
  terminate2()
  store.next(3)
  expect(observerMock).toHaveBeenCalledTimes(1)
})

it('Compose middlewares', () => {
  let mock1 = vi.fn()
  let mock2 = vi.fn()
  let store = storeYobta(
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
  let store = storeYobta(1)
  let readyMock = vi.fn()
  let unsubscribe = store.onReady(readyMock)
  let unobserve = store.observe(vi.fn())
  expect(readyMock).toHaveBeenCalledTimes(1)
  expect(readyMock).toHaveBeenCalledWith(1)
  unsubscribe()
  unobserve()
  expect(readyMock).toHaveBeenCalledTimes(1)
})

it('subscribes to idle event', () => {
  let store = storeYobta(1)
  let idleMock = vi.fn()
  let unsubscribe = store.onIdle(idleMock)
  let unobserve = store.observe(vi.fn())
  expect(idleMock).toHaveBeenCalledTimes(0)
  unobserve()
  unsubscribe()
  expect(idleMock).toHaveBeenCalledTimes(1)
  expect(idleMock).toHaveBeenCalledWith(1)
})

it('emits beforeUpdate on ready when state is not changed by the middleware', () => {
  let store = storeYobta(1)
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  let unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
})

it('emits beforeUpdate on ready when state is changed by the middleware', () => {
  let store = storeYobta(1, ({ addMiddleware }) => {
    addMiddleware(YOBTA_READY, state => state + 1)
  })
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  let unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(2)
  unobserve()
  unsubscribe()
})

it('emits beforeUpdate on ready when state is not changed by next', () => {
  let store = storeYobta(1)
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  store.next(1)
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unsubscribe()
})
it('emits beforeUpdate on ready when state is changed by next', () => {
  let store = storeYobta(1)
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  store.next(2)
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(2)
  unsubscribe()
})

it('emits beforeUpdate on idle when state is not changed by the middleware', () => {
  let store = storeYobta(1)
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  let unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
  expect(transitionMock).toHaveBeenCalledTimes(2)
  expect(transitionMock).toHaveBeenCalledWith(1)
})

it('emits beforeUpdate on idle when state is changed by the middleware', () => {
  let store = storeYobta(1, ({ addMiddleware }) => {
    addMiddleware(YOBTA_IDLE, state => {
      return state + 1
    })
  })
  let transitionMock = vi.fn()
  let unsubscribe = store.onBeforeUpdate(transitionMock)
  let unobserve = store.observe(vi.fn())
  expect(transitionMock).toHaveBeenCalledTimes(1)
  expect(transitionMock).toHaveBeenCalledWith(1)
  unobserve()
  unsubscribe()
  expect(transitionMock).toHaveBeenCalledTimes(2)
  expect(transitionMock).toHaveBeenCalledWith(2)
})
