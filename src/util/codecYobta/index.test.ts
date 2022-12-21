import { codecYobta } from './index.js'

const last = vi.fn()

it('encodes', () => {
  let value = { a: 'b' }
  expect(codecYobta.encode(value)).toBe(JSON.stringify([value]))
})
it('decodes', () => {
  let value = codecYobta.decode('1', last)

  expect(value).toBe(1)
  expect(last).not.toBeCalled()
})
it('falls back', () => {
  let value = codecYobta.decode(undefined, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
it('falls back when null', () => {
  let value = codecYobta.decode(null, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
