import { replicatedYobta } from './index.js'
import {
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from '../../observableYobta/index.js'

const backendSpy = {
  ready: vi.fn(),
  observe: vi.fn(() => vi.fn()),
  next: vi.fn(),
}
const addMiddlewareSpy = vi.fn()
const nextSpy = vi.fn()

const replicated = replicatedYobta(backendSpy)

it('adds middleware', () => {
  replicated({
    addMiddleware: addMiddlewareSpy,
    next: nextSpy,
    initialState: 'yobta',
  })

  expect(addMiddlewareSpy).toHaveBeenCalledTimes(3)
  expect(addMiddlewareSpy).toHaveBeenCalledWith(
    YOBTA_READY,
    expect.any(Function),
  )
  expect(addMiddlewareSpy).toHaveBeenCalledWith(
    YOBTA_IDLE,
    expect.any(Function),
  )
  expect(addMiddlewareSpy).toHaveBeenCalledWith(
    YOBTA_NEXT,
    expect.any(Function),
  )
})

it('handles ready state', () => {
  replicated({
    addMiddleware: addMiddlewareSpy,
    next: nextSpy,
    initialState: 'yobta',
  })
  addMiddlewareSpy.mock.calls[0][1]('yobta')
  expect(backendSpy.observe).toHaveBeenCalledWith(nextSpy)
  expect(backendSpy.ready).toHaveBeenCalledWith('yobta')
  expect(backendSpy.next).not.toHaveBeenCalled()
})

it('handles idle state', () => {
  replicated({
    addMiddleware: addMiddlewareSpy,
    next: nextSpy,
    initialState: 'yobta',
  })
  addMiddlewareSpy.mock.calls[1][1]('yobta')
  expect(backendSpy.ready).not.toHaveBeenCalled()
  expect(backendSpy.observe).not.toHaveBeenCalled()
  expect(backendSpy.next).not.toHaveBeenCalled()
})

it('handles next state', () => {
  replicated({
    addMiddleware: addMiddlewareSpy,
    next: nextSpy,
    initialState: 'yobta',
  })
  addMiddlewareSpy.mock.calls[2][1]('yobta')
  expect(backendSpy.ready).not.toHaveBeenCalled()
  expect(backendSpy.observe).not.toHaveBeenCalled()
  expect(backendSpy.next).toHaveBeenCalledWith('yobta')
})

it('unsubscribes', () => {
  replicated({
    addMiddleware: addMiddlewareSpy,
    next: nextSpy,
    initialState: 'yobta',
  })
  addMiddlewareSpy.mock.calls[0][1]('yobta')
  addMiddlewareSpy.mock.calls[1][1]()
  expect(backendSpy.next).not.toHaveBeenCalled()
})
