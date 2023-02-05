import { jsonCodec } from './index.js'

const last = vi.fn()

it('encodes', () => {
  let value = { a: 'b' }
  expect(jsonCodec.encode(value)).toBe(JSON.stringify([value]))
})
it('decodes', () => {
  let value = jsonCodec.decode('1', last)

  expect(value).toBe(1)
  expect(last).not.toBeCalled()
})
it('falls back', () => {
  let value = jsonCodec.decode(undefined, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
it('falls back when null', () => {
  let value = jsonCodec.decode(null, () => {
    last()
    return 'yobta'
  })
  expect(last).toBeCalledTimes(1)
  expect(value).toEqual(['yobta'])
})
