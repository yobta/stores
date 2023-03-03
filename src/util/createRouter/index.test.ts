import { vi } from 'vitest'

import { createRouter } from './index.js'

describe('create router', () => {
  it('creates router instance without errors', () => {
    let router = createRouter()
    expect(router).toMatchObject({
      subscribe: expect.any(Function),
      publish: expect.any(Function),
    })
  })

  it('subscribe and publish without dynamical params', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()
    router.subscribe('/user/123', mockSubscriber)
    router.publish('/user/123', 'data', 'ovrl1', 'ovrl2')
    expect(mockSubscriber).toBeCalledTimes(1)
    expect(mockSubscriber).toBeCalledWith({}, 'data', 'ovrl1', 'ovrl2')
  })

  it('unsubscribes listener', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()
    let unsubscribe = router.subscribe('/user/123', mockSubscriber)
    unsubscribe()
    router.publish('/user/123', 'data')
    expect(mockSubscriber).not.toBeCalled()
  })

  it('subscribe and publish with dynamical params', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()
    router.subscribe('/user/:id', mockSubscriber)
    router.publish('/user/123', 'data', 'ovrl1', 'ovrl2')
    expect(mockSubscriber).toBeCalledTimes(1)
    expect(mockSubscriber).toBeCalledWith(
      { id: '123' },
      'data',
      'ovrl1',
      'ovrl2',
    )
  })

  it('ignores case sensitive', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()
    router.subscribe('/usEr/:id', mockSubscriber)
    router.publish('/user/Userid', 'data')
    router.publish('/user/userId', 'data')
    expect(mockSubscriber).toBeCalledTimes(2)
    expect(mockSubscriber).toBeCalledWith({ id: 'userid' }, 'data')
  })

  it('ignores trailing slash in publish path', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()
    router.subscribe('/user/:id', mockSubscriber)
    router.publish('/user/Userid/', 'data')
    expect(mockSubscriber).toBeCalledTimes(1)
    expect(mockSubscriber).toBeCalledWith({ id: 'userid' }, 'data')
  })

  it('publishes to all subscribers with the same route', () => {
    let router = createRouter()
    let mockSubscriber1 = vi.fn()
    let mockSubscriber2 = vi.fn()
    router.subscribe('/user/:id', mockSubscriber1)
    router.subscribe('/user/:id', mockSubscriber2)
    router.publish('/user/Userid', 'data')

    expect(mockSubscriber2).toBeCalledTimes(1)
    expect(mockSubscriber2).toBeCalledWith({ id: 'userid' }, 'data')
    expect(mockSubscriber1).toBeCalledTimes(1)
    expect(mockSubscriber1).toBeCalledWith({ id: 'userid' }, 'data')
  })

  it('publishes to all subscribers with the same route and different params names', () => {
    let router = createRouter()
    let mockSubscriber1 = vi.fn()
    let mockSubscriber2 = vi.fn()
    router.subscribe('/user/:userid', mockSubscriber1)
    router.subscribe('/user/:id', mockSubscriber2)
    router.publish('/user/Userid', 'data')

    expect(mockSubscriber2).toBeCalledTimes(1)
    expect(mockSubscriber2).toBeCalledWith({ id: 'userid' }, 'data')
    expect(mockSubscriber1).toBeCalledTimes(1)
    expect(mockSubscriber1).toBeCalledWith({ userid: 'userid' }, 'data')
  })

  it('doesn`t handle unmatched publish', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()

    router.subscribe('/user/:id', mockSubscriber)

    router.publish('/user/123/name', 'data', 'ovrl1', 'ovrl2')

    expect(mockSubscriber).not.toBeCalled()
  })

  it('doesn`t handle unmatched publish without dynamical params', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()

    router.subscribe('/user/123', mockSubscriber)

    router.publish('/user/123/name', 'data', 'ovrl1', 'ovrl2')

    expect(mockSubscriber).not.toBeCalled()
  })

  it('subscribes to empty route', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()

    router.subscribe('', mockSubscriber)

    router.publish('/', 'data')
    router.publish('', 'data')

    expect(mockSubscriber).toBeCalledTimes(2)
  })

  it('doesn`t handle params with wrong syntax', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()

    router.subscribe('/user/?:id', mockSubscriber)

    router.publish('/user/?123', 'data')

    expect(mockSubscriber).toBeCalledTimes(0)
  })

  it('allow optional params', () => {
    let router = createRouter()
    let mockSubscriber = vi.fn()

    router.subscribe('/user/:id/:name?', mockSubscriber)

    router.publish('/user/123', 'data')

    expect(mockSubscriber).toBeCalledTimes(1)
  })
})
