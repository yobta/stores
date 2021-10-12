import { isEmptyArray } from '.'

describe('isEmptyArray', () => {
  it('returns true for empty arrays', () => {
    let result = isEmptyArray([])
    expect(result).toBe(true)
  })
  it('returns false for non-empty arrays', () => {
    let result = isEmptyArray([null])
    expect(result).toBe(false)
  })
})
