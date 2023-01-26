import { pubSubYobta } from './index.js'

it('creates pub/sub', () => {
  let pubSub = pubSubYobta()
  expect(pubSub.publish).toBeInstanceOf(Function)
  expect(pubSub.subscribe).toBeInstanceOf(Function)
  expect(pubSub.unsubscribe).toBeInstanceOf(Function)
})

it('notifies', () => {
  let spy = vi.fn()
  let pubSub = pubSubYobta()
  let unsubscribe = pubSub.subscribe('topic', spy)

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
  let spy = vi.fn()
  let pubSub = pubSubYobta()
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
