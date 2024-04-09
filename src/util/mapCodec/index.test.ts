import { mapCodec } from './index.js'

const fallback = vi.fn()

it('encodes empty map', () => {
  const map = new Map()
  expect(mapCodec.encode(map)).toBe('[[]]')
})
it('encodes filled map', () => {
  const map = new Map([['a', 1]])
  expect(mapCodec.encode(map)).toBe('[[["a",1]]]')
})
it('encodes overloads', () => {
  const map = new Map()
  expect(mapCodec.encode(map, 'overload')).toBe('[[],"overload"]')
})
it('decodes', () => {
  const value = '[[["a",1]],1,2,3]'
  const map = new Map([['a', 1]])
  expect(mapCodec.decode(value, fallback)).toEqual([map, 1, 2, 3])
  expect(fallback).not.toBeCalled()
})
it('fallsback', () => {
  const result = mapCodec.decode(undefined as any, () => {
    fallback()
    return new Map()
  })
  expect(fallback).toBeCalledTimes(1)
  expect(result).toEqual([new Map()])
})
