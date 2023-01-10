import { diffObjectYobta } from './index.js'

it('returns correct diff', () => {
  let inputObject = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }
  let referenceObject = {
    key1: 'value1',
    key2: 'differentValue2',
    key4: 'value4',
  }
  let expectedDiffObject = {
    key2: 'value2',
    key3: 'value3',
  }
  let diffObject = diffObjectYobta(inputObject, referenceObject)
  expect(diffObject).toEqual(expectedDiffObject)
})

it('handles empty objects correctly', () => {
  let inputObject = {}
  let referenceObject = {}
  let expectedDiffObject = {}
  let diffObject = diffObjectYobta(inputObject, referenceObject)
  expect(diffObject).toEqual(expectedDiffObject)
})

it('handles empty reference object correctly', () => {
  let inputObject = {
    key1: 'value1',
    key2: 'value2',
  }
  let referenceObject = {}
  let expectedDiffObject = {
    key1: 'value1',
    key2: 'value2',
  }
  let diffObject = diffObjectYobta(inputObject, referenceObject)
  expect(diffObject).toEqual(expectedDiffObject)
})

it('handles different types of keys and values correctly', () => {
  let inputObject = {
    1: 'value1',
    true: 'value2',
    key3: false,
  }
  let referenceObject = {
    1: 'value1',
    true: 'differentValue2',
    key3: true,
  }
  let expectedDiffObject = {
    true: 'value2',
    key3: false,
  }
  let diffObject = diffObjectYobta(inputObject, referenceObject)
  expect(diffObject).toEqual(expectedDiffObject)
})
