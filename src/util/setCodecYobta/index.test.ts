import { setCodecYobta } from './index.js'

const fallback = vi.fn()

it('encodes empty set', () => {
  let set = new Set<number>()
  expect(setCodecYobta.encode(set)).toBe('[[]]')
})
it('encodes filled set', () => {
  let set = new Set(['a', 1])
  expect(setCodecYobta.encode(set)).toBe('[["a",1]]')
})
it('encodes overloads', () => {
  let set = new Set<number>()
  expect(setCodecYobta.encode(set, 'overload')).toBe('[[],"overload"]')
})
it('decodes', () => {
  let value = '[["a",1],1,2,3]'
  let set = new Set(['a', 1])
  expect(setCodecYobta.decode(value, fallback)).toEqual([set, 1, 2, 3])
  expect(fallback).not.toBeCalled()
})
it('fallsback', () => {
  let result = setCodecYobta.decode(undefined as any, () => {
    fallback()
    return new Set<number>()
  })
  expect(fallback).toBeCalledTimes(1)
  expect(result).toEqual([new Set()])
})
