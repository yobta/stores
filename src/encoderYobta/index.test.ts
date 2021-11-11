import { decodeYobta, encodeYobta } from '.'

describe('jsonEncoder', () => {
  it('encodes', () => {
    let value = { a: 'b' }
    expect(encodeYobta(value)).toBe(JSON.stringify(value))
  })
  it('decodes', () => {
    let value = '1'
    expect(decodeYobta(value)).toBe(1)
  })
})
