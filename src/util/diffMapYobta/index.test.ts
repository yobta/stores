import { diffcreateMapStore } from './index.js'

it('returns a new Map containing the key-value pairs in `inputMap` that are not present in `referenceMap`, or have different values in `referenceMap`', () => {
  let inputMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
    ['key3', 'value3'],
  ])
  let referenceMap = new Map([
    ['key1', 'value1'],
    ['key2', 'differentValue2'],
    ['key4', 'value4'],
  ])
  let expectedDiffMap = new Map([
    ['key2', 'value2'],
    ['key3', 'value3'],
  ])
  let diffMap = diffcreateMapStore(inputMap, referenceMap)
  expect(diffMap).toEqual(expectedDiffMap)
})

it('returns an empty Map when the input maps are both empty', () => {
  let inputMap = new Map()
  let referenceMap = new Map()
  let expectedDiffMap = new Map()
  let diffMap = diffcreateMapStore(inputMap, referenceMap)
  expect(diffMap).toEqual(expectedDiffMap)
})

it('returns a copy of the input map when the reference map is empty', () => {
  let inputMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ])
  let referenceMap = new Map()
  let expectedDiffMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ])
  let diffMap = diffcreateMapStore(inputMap, referenceMap)
  expect(diffMap).toEqual(expectedDiffMap)
})

it('handles maps with different types of keys and values correctly', () => {
  let inputMap = new Map<any, any>([
    [1, 'value1'],
    [true, 'value2'],
    ['key3', false],
  ])
  let referenceMap = new Map<any, any>([
    [1, 'value1'],
    [true, 'differentValue2'],
    ['key3', true],
  ])
  let expectedDiffMap = new Map<any, any>([
    [true, 'value2'],
    ['key3', false],
  ])
  let diffMap = diffcreateMapStore(inputMap, referenceMap)
  expect(diffMap).toEqual(expectedDiffMap)
})
