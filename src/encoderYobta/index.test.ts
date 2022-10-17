import { encoderYobta } from './index.js'

describe('jsonEncoder', () => {
  it('encodes', () => {
    let value = { a: 'b' }
    expect(encoderYobta.encode(value)).toBe(JSON.stringify(value))
  })
  it('decodes', () => {
    let value = '1'
    expect(encoderYobta.decode(value)).toBe(1)
  })
  it('catches', () => {
    let value = encoderYobta.decode(undefined)
    expect(value).toEqual(expect.any(Error))
  })
})
