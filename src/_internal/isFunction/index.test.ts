import { isFunction } from '.'

describe('isFunction', () => {
  it('returns true for functions', () => {
    let result = isFunction(() => null)
    expect(result).toBe(true)
  })
  it('returns false for non-functions', () => {
    let result = isFunction(null)
    expect(result).toBe(false)
  })
})
