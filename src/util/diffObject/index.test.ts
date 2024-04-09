import { diffObject } from './index.js'

it('returns correct diff', () => {
  const inputObject = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }
  const referenceObject = {
    key1: 'value1',
    key2: 'differentValue2',
    key4: 'value4',
  }
  const expectedDiffObject = {
    key2: 'value2',
    key3: 'value3',
  }
  const diff = diffObject(inputObject, referenceObject)
  expect(diff).toEqual(expectedDiffObject)
})

it('handles empty objects correctly', () => {
  const inputObject = {}
  const referenceObject = {}
  const expectedDiffObject = {}
  const diff = diffObject(inputObject, referenceObject)
  expect(diff).toEqual(expectedDiffObject)
})

it('handles empty reference object correctly', () => {
  const inputObject = {
    key1: 'value1',
    key2: 'value2',
  }
  const referenceObject = {}
  const expectedDiffObject = {
    key1: 'value1',
    key2: 'value2',
  }
  const diff = diffObject(inputObject, referenceObject)
  expect(diff).toEqual(expectedDiffObject)
})

it('handles different types of keys and values correctly', () => {
  const inputObject = {
    1: 'value1',
    true: 'value2',
    key3: false,
  }
  const referenceObject = {
    1: 'value1',
    true: 'differentValue2',
    key3: true,
  }
  const expectedDiffObject = {
    true: 'value2',
    key3: false,
  }
  const diff = diffObject(inputObject, referenceObject)
  expect(diff).toEqual(expectedDiffObject)
})
