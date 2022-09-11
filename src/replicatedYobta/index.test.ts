import { replicatedYobta } from './index.js'
import { localStorageYobta } from '../localStorageYobta/index.js'
import {
  YOBTA_IDLE,
  YOBTA_INIT,
  YOBTA_NEXT,
  YOBTA_READY,
  StoreEvent,
  StoreMiddleware,
} from '../observableYobta/index.js'

let handlersSpy = {
  [YOBTA_INIT]: vi.fn(),
  [YOBTA_IDLE]: vi.fn(),
  [YOBTA_READY]: vi.fn(),
  [YOBTA_NEXT]: vi.fn(),
}
let addMiddlewareSpy = vi.fn<[StoreEvent, StoreMiddleware<string>], void>()

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  addMiddlewareSpy.mockImplementation((type, handler) => {
    handlersSpy[type].mockImplementation(handler)
  })
})

const initialState = 'one'

describe('replicatedYobta', () => {
  it('adds tree middlewares', () => {
    replicatedYobta({
      channel: 'test',
      backend: localStorageYobta,
    })({ addMiddleware: addMiddlewareSpy, initialState, next: () => {} })
    expect(addMiddlewareSpy).toHaveBeenCalledTimes(3)
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      1,
      YOBTA_READY,
      expect.any(Function),
    )
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      2,
      YOBTA_IDLE,
      expect.any(Function),
    )
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      3,
      YOBTA_NEXT,
      expect.any(Function),
    )
  })

  it('subscribe backend when READY', () => {
    let subscribeSpy = vi.fn().mockImplementation(localStorageYobta.subscribe)
    let localStorageMock = { ...localStorageYobta, subscribe: subscribeSpy }

    replicatedYobta({
      channel: 'test',
      backend: localStorageMock,
    })({ addMiddleware: addMiddlewareSpy, initialState, next: () => {} })

    let state1 = handlersSpy[YOBTA_READY]('one')
    expect(state1).toBe('one')

    expect(subscribeSpy).toHaveBeenCalledTimes(1)
    expect(subscribeSpy).toHaveBeenNthCalledWith(
      1,
      'test',
      expect.any(Function),
    )
  })

  it('publishes on backend when NEXT', () => {
    let publishSpy = vi.fn().mockImplementation(localStorageYobta.publish)
    let localStorageMock = { ...localStorageYobta, publish: publishSpy }

    replicatedYobta({
      channel: 'test',
      backend: localStorageMock,
    })({ addMiddleware: addMiddlewareSpy, initialState, next: () => {} })

    let state1 = handlersSpy[YOBTA_NEXT]('two')
    expect(state1).toBe('two')

    expect(publishSpy).toHaveBeenCalledTimes(1)
    expect(publishSpy).toHaveBeenNthCalledWith(1, 'test', 'two')
  })

  it('unsubscribes backend when IDLE', () => {
    let unsubscribeSpy = vi.fn()
    let subscribeSpy = vi
      .fn()
      .mockImplementation((type, msg) =>
        unsubscribeSpy.mockImplementation(
          localStorageYobta.subscribe(type, msg),
        ),
      )
    let localStorageMock = { ...localStorageYobta, subscribe: subscribeSpy }

    replicatedYobta({
      channel: 'test',
      backend: localStorageMock,
    })({ addMiddleware: addMiddlewareSpy, initialState, next: () => {} })

    let state1 = handlersSpy[YOBTA_READY]('one')
    expect(state1).toBe('one')

    let state2 = handlersSpy[YOBTA_IDLE]('two')
    expect(state2).toBe('two')
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1)
  })

  it('validates remote value', () => {
    let unsubscribeSpy = vi.fn()
    let validateSpy = vi.fn()
    let subscribeSpy = vi
      .fn()
      .mockImplementation((type, msg) =>
        unsubscribeSpy.mockImplementation(
          localStorageYobta.subscribe(type, msg),
        ),
      )
    let localStorageMock = { ...localStorageYobta, subscribe: subscribeSpy }

    replicatedYobta({
      channel: 'test',
      backend: localStorageMock,
      validate: validateSpy,
    })({ addMiddleware: addMiddlewareSpy, initialState, next: () => {} })

    let state1 = handlersSpy[YOBTA_READY]('one')
    expect(state1).toBe('one')

    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
