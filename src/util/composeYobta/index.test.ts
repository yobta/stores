/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { composeYobta } from './index.js'

it('composes a single function correctly', () => {
  let addOne = (x: number) => x + 1
  let composed = composeYobta(addOne)
  expect(composed(1)).toEqual(2)
})

it('composes two functions correctly', () => {
  let addOne = (x: number) => x + 1
  let double = (x: number) => x * 2
  let composed = composeYobta(double, addOne)
  expect(composed(1)).toEqual(4)
})

it('composes three functions correctly', () => {
  let addOne = (x: number) => x + 1
  let double = (x: number) => x * 2
  let triple = (x: number) => x * 3
  let composed = composeYobta(triple, double, addOne)
  expect(composed(1)).toEqual(12)
})

it('composes four functions correctly', () => {
  let addOne = (x: number) => x + 1
  let double = (x: number) => x * 2
  let triple = (x: number) => x * 3
  let quadruple = (x: number) => x * 4
  let composed = composeYobta(quadruple, triple, double, addOne)
  expect(composed(1)).toEqual(48)
})

it('returns input when given no functions', () => {
  // @ts-ignore
  let composed = composeYobta()
  // @ts-ignore
  expect(composed(1)).toEqual(1)
})

test('documentation case', () => {
  let double = (x: number): number => x * 2
  let addOne = (x: number): number => x + 1
  let doubleAndAddOne = composeYobta(addOne, double)
  let result = doubleAndAddOne(5)
  expect(result).toEqual(11)
})

test('documentation case with overloads', () => {
  let operations: string[] = []
  let add = (x: number, o: string[]) => {
    o.push('add 1')
    return x + 1
  }
  let multiply = (x: number, o: string[]) => {
    o.push('multiply by 2')
    return x * 2
  }
  let addThenMultiply = composeYobta(multiply, add)
  let result = addThenMultiply(2, operations)
  expect(result).toBe(6)
  expect(operations).toEqual(['add 1', 'multiply by 2'])
})
