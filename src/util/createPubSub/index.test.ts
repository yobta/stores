import { createPubSub } from './index.js'

it('creates pub/sub', () => {
  const pubSub = createPubSub()
  expect(pubSub.publish).toBeInstanceOf(Function)
  expect(pubSub.subscribe).toBeInstanceOf(Function)
  expect(pubSub.unsubscribe).toBeInstanceOf(Function)
})

it('notifies', () => {
  const spy = vi.fn()
  const pubSub = createPubSub()
  const unsubscribe = pubSub.subscribe('topic', spy)

  expect(spy).not.toBeCalled()

  pubSub.publish('topic', 'data')

  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toBeCalledWith('data')

  unsubscribe()

  pubSub.publish('topic', 'data')

  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toBeCalledWith('data')
})

it('unsubscrbes', () => {
  const spy = vi.fn()
  const pubSub = createPubSub()
  pubSub.subscribe('topic', spy)

  expect(spy).not.toBeCalled()

  pubSub.publish('topic', 'data')

  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toBeCalledWith('data')

  pubSub.unsubscribe('topic', spy)

  pubSub.publish('topic', 'data')

  expect(spy).toHaveBeenCalledOnce()
  expect(spy).toBeCalledWith('data')
})
