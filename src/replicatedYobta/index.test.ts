import { replicatedYobta } from './index.js'
import { localStorageYobta } from '../localStorageYobta/index.js'
import {
  IDLE,
  INIT,
  NEXT,
  READY,
  StoreEvent,
  StoreMiddleware,
} from '../observableYobta/index.js'

let handlersSpy = {
  [INIT]: vi.fn(),
  [IDLE]: vi.fn(),
  [READY]: vi.fn(),
  [NEXT]: vi.fn(),
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
    })({ addMiddleware: addMiddlewareSpy, initialState })
    expect(addMiddlewareSpy).toHaveBeenCalledTimes(3)
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      1,
      READY,
      expect.any(Function),
    )
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      2,
      IDLE,
      expect.any(Function),
    )
    expect(addMiddlewareSpy).toHaveBeenNthCalledWith(
      3,
      NEXT,
      expect.any(Function),
    )
  })

  it('subscribe backend when READY', () => {
    let subscribeSpy = vi.fn().mockImplementation(localStorageYobta.subscribe)
    let localStorageMock = { ...localStorageYobta, subscribe: subscribeSpy }

    replicatedYobta({
      channel: 'test',
      backend: localStorageMock,
    })({ addMiddleware: addMiddlewareSpy, initialState })

    handlersSpy[READY]('one')

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
    })({ addMiddleware: addMiddlewareSpy, initialState })

    handlersSpy[NEXT]('two')

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
    })({ addMiddleware: addMiddlewareSpy, initialState })

    handlersSpy[READY]('one')
    handlersSpy[IDLE]('one')

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
    })({ addMiddleware: addMiddlewareSpy, initialState })

    handlersSpy[READY]('one')

    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
