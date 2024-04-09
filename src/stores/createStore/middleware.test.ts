import { composeMiddleware } from './middleware.js'

it('should return an object with three middlewares', () => {
  const middlewares = composeMiddleware({
    initialState: {},
    last: () => ({}),
    next: () => {},
    plugins: [],
  })
  expect(middlewares).toEqual({
    ready: expect.any(Function),
    idle: expect.any(Function),
    next: expect.any(Function),
  })
})

it('should return same value when has no plugins', () => {
  const middlewares = composeMiddleware({
    initialState: {},
    last: () => ({}),
    next: () => {},
    plugins: [],
  })
  expect(middlewares.ready('yobta')).toEqual('yobta')
  expect(middlewares.idle('yobta')).toEqual('yobta')
  expect(middlewares.next('yobta')).toEqual('yobta')
})

it('should return plugin value when has one plugin', () => {
  const middlewares = composeMiddleware({
    initialState: 0,
    last: () => 0,
    next: () => {},
    plugins: [
      context => {
        context.addMiddleware('ready', state => {
          return state + 1
        })
      },
      context => {
        context.addMiddleware('idle', state => state + 1)
      },
      context => {
        context.addMiddleware('next', state => state + 1)
      },
    ],
  })
  expect(middlewares.ready(1)).toEqual(2)
  expect(middlewares.idle(1)).toEqual(2)
  expect(middlewares.next(1)).toEqual(2)
})

it('should return first plugin value when has two plugins', () => {
  const middlewares = composeMiddleware({
    initialState: 0,
    last: () => 0,
    next: () => {},
    plugins: [
      context => {
        context.addMiddleware('ready', () => 0)
      },
      context => {
        context.addMiddleware('ready', () => 1)
      },
      context => {
        context.addMiddleware('idle', () => 0)
      },
      context => {
        context.addMiddleware('idle', () => 1)
      },
      context => {
        context.addMiddleware('next', () => 0)
      },
      context => {
        context.addMiddleware('next', () => 1)
      },
    ],
  })
  expect(middlewares.ready(2)).toEqual(0)
  expect(middlewares.idle(2)).toEqual(0)
  expect(middlewares.next(2)).toEqual(0)
})
