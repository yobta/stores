import { encoderYobta } from './index.js'

it('encodes', () => {
  let value = { a: 'b' }
  expect(encoderYobta.encode(value)).toBe(JSON.stringify(value))
})
it('decodes', () => {
  let value = '1'
  expect(encoderYobta.decode(value)).toBe(1)
})
it('throws', () => {
  expect(() => encoderYobta.decode(undefined)).toThrow()
})
