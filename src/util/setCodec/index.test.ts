import { setCodec } from './index.js'

const fallback = vi.fn()

it('encodes empty set', () => {
  const set = new Set<number>()
  expect(setCodec.encode(set)).toBe('[[]]')
})
it('encodes filled set', () => {
  const set = new Set(['a', 1])
  expect(setCodec.encode(set)).toBe('[["a",1]]')
})
it('encodes overloads', () => {
  const set = new Set<number>()
  expect(setCodec.encode(set, 'overload')).toBe('[[],"overload"]')
})
it('decodes', () => {
  const value = '[["a",1],1,2,3]'
  const set = new Set(['a', 1])
  expect(setCodec.decode(value, fallback)).toEqual([set, 1, 2, 3])
  expect(fallback).not.toBeCalled()
})
it('fallsback', () => {
  const result = setCodec.decode(undefined as any, () => {
    fallback()
    return new Set<number>()
  })
  expect(fallback).toBeCalledTimes(1)
  expect(result).toEqual([new Set()])
})
