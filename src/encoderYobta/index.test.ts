import { decodeYobta, encodeYobta } from './index.js'

describe('jsonEncoder', () => {
  it('encodes', () => {
    let value = { a: 'b' }
    expect(encodeYobta(value)).toBe(JSON.stringify(value))
  })
  it('decodes', () => {
    let value = '1'
    expect(decodeYobta(value)).toBe(1)
  })
  it('catches', () => {
    let value = decodeYobta(undefined)
    expect(value).toEqual(expect.any(Error))
  })
})
