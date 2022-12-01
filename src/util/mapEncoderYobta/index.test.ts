import { mapEncoderYobta } from './index.js'

const fallback = vi.fn()

it('encodes empty map', () => {
  let map = new Map()
  expect(mapEncoderYobta.encode(map)).toBe('[[]]')
})
it('encodes filled map', () => {
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.encode(map)).toBe('[[["a",1]]]')
})
it('encodes overloads', () => {
  let map = new Map()
  expect(mapEncoderYobta.encode(map, 'overload')).toBe('[[],"overload"]')
})
it('decodes', () => {
  let value = '[[["a",1]],1,2,3]'
  let map = new Map([['a', 1]])
  expect(mapEncoderYobta.decode(value, fallback)).toEqual([map, 1, 2, 3])
  expect(fallback).not.toBeCalled()
})
it('fallsback', () => {
  let result = mapEncoderYobta.decode(undefined as any, () => {
    fallback()
    return new Map()
  })
  expect(fallback).toBeCalledTimes(1)
  expect(result).toEqual([new Map()])
})
