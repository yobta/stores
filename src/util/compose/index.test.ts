/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { compose } from './index.js'

it('composes a single function correctly', () => {
  const addOne = (x: number) => x + 1
  const composed = compose(addOne)
  expect(composed(1)).toEqual(2)
})

it('composes two functions correctly', () => {
  const addOne = (x: number) => x + 1
  const double = (x: number) => x * 2
  const composed = compose(double, addOne)
  expect(composed(1)).toEqual(4)
})

it('composes three functions correctly', () => {
  const addOne = (x: number) => x + 1
  const double = (x: number) => x * 2
  const triple = (x: number) => x * 3
  const composed = compose(triple, double, addOne)
  expect(composed(1)).toEqual(12)
})

it('composes four functions correctly', () => {
  const addOne = (x: number) => x + 1
  const double = (x: number) => x * 2
  const triple = (x: number) => x * 3
  const quadruple = (x: number) => x * 4
  const composed = compose(quadruple, triple, double, addOne)
  expect(composed(1)).toEqual(48)
})

it('returns input when given no functions', () => {
  // @ts-ignore
  const composed = compose()
  // @ts-ignore
  expect(composed(1)).toEqual(1)
})

test('documentation case', () => {
  const double = (x: number): number => x * 2
  const addOne = (x: number): number => x + 1
  const doubleAndAddOne = compose(addOne, double)
  const result = doubleAndAddOne(5)
  expect(result).toEqual(11)
})

test('documentation case with overloads', () => {
  const operations: string[] = []
  const add = (x: number, o: string[]) => {
    o.push('add 1')
    return x + 1
  }
  const multiply = (x: number, o: string[]) => {
    o.push('multiply by 2')
    return x * 2
  }
  const addThenMultiply = compose(multiply, add)
  const result = addThenMultiply(2, operations)
  expect(result).toBe(6)
  expect(operations).toEqual(['add 1', 'multiply by 2'])
})
