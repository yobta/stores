import { diffMap } from './index.js'

it('returns a new Map containing the key-value pairs in `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`', () => {
  const inputMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
    ['key3', 'value3'],
  ])
  const referenceMap = new Map([
    ['key1', 'value1'],
    ['key2', 'differentValue2'],
    ['key4', 'value4'],
  ])
  const expectedDiffMap = new Map([
    ['key2', 'value2'],
    ['key3', 'value3'],
  ])
  const diff = diffMap(inputMap, referenceMap)
  expect(diff).toEqual(expectedDiffMap)
})

it('returns an empty Map when the input maps are both empty', () => {
  const inputMap = new Map()
  const referenceMap = new Map()
  const expectedDiffMap = new Map()
  const diff = diffMap(inputMap, referenceMap)
  expect(diff).toEqual(expectedDiffMap)
})

it('returns a copy of the input map when the reference map is empty', () => {
  const inputMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ])
  const referenceMap = new Map()
  const expectedDiffMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ])
  const diff = diffMap(inputMap, referenceMap)
  expect(diff).toEqual(expectedDiffMap)
})

it('handles maps with different types of keys and values correctly', () => {
  const inputMap = new Map<any, any>([
    [1, 'value1'],
    [true, 'value2'],
    ['key3', false],
  ])
  const referenceMap = new Map<any, any>([
    [1, 'value1'],
    [true, 'differentValue2'],
    ['key3', true],
  ])
  const expectedDiffMap = new Map<any, any>([
    [true, 'value2'],
    ['key3', false],
  ])
  const diff = diffMap(inputMap, referenceMap)
  expect(diff).toEqual(expectedDiffMap)
})
