import { encoderYobta } from './index.js'

const last = vi.fn()

it('encodes', () => {
  let value = { a: 'b' }
  expect(encoderYobta.encode(value)).toBe(JSON.stringify(value))
})
it('decodes', () => {
  let value = '1'
  expect(encoderYobta.decode(value, last)).toBe(1)
  expect(last).not.toBeCalled()
})
it('falls back', () => {
  encoderYobta.decode(undefined, last)
  expect(last).toBeCalledTimes(1)
})
