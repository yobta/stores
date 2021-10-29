import { decode, encode } from '.'

describe('jsonEncoder', () => {
  it('encodes', () => {
    let value = { a: 'b' }
    expect(encode(value)).toBe(JSON.stringify(value))
  })
  it('decodes', () => {
    let value = '1'
    expect(decode(value)).toBe(1)
  })
})
