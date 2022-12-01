import { encoderYobta } from './index.js'

const last = vi.fn()

it('encodes', () => {
  let value = { a: 'b' }
  expect(encoderYobta.encode(value)).toBe(JSON.stringify([value]))
})
it('decodes', () => {
  let value = encoderYobta.decode('1', last)

  expect(value).toBe(1)
  expect(last).not.toBeCalled()
})
it('falls back', () => {
  let value = encoderYobta.decode(undefined, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
it('falls back when null', () => {
  let value = encoderYobta.decode(null, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
