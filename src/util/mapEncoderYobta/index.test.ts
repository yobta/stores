import { mapEncoderYobta } from './index.js'

it('encodes', () => {
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.encode(map, 1, 2, 3)).toBe('[[["a",1]],1,2,3]')
})
it('decodes', () => {
  let value = '[[["a",1]],1,2,3]'
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.decode(value)).toEqual([map, 1, 2, 3])
})
it('catches', () => {
  expect(() => mapEncoderYobta.decode(undefined as any)).toThrow()
})
