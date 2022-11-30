import { mapEncoderYobta } from './index.js'

const fallback = vi.fn()

it('encodes', () => {
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.encode(map, 1, 2, 3)).toBe('[[["a",1]],1,2,3]')
})
it('decodes', () => {
  let value = '[[["a",1]],1,2,3]'
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.decode(value, fallback)).toEqual([map, 1, 2, 3])
  expect(fallback).not.toBeCalled()
})
it('fallsback', () => {
  mapEncoderYobta.decode(undefined as any, fallback)
  expect(fallback).toBeCalledTimes(1)
})
