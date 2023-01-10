type AnyFunction = (arg: any, ...overloads: any[]) => any
type Compose<
  Functions extends [AnyFunction, ...AnyFunction[]],
  Next extends AnyFunction[] = Shift<Functions>,
> = {
  [K in keyof Functions]: (
    arg: ReturnType<Find<Next, K, any>>,
    ...overloads: Overloads<Functions>
  ) => ReturnType<Functions[K]>
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Overloads<F extends AnyFunction[]> = F extends [
  (input: infer I, ...overloads: infer O) => any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...infer R,
]
  ? O
  : never
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer F, infer L] ? L : never
type Shift<T extends any[]> = T extends [any, ...infer R] ? R : never
type ArgType<F, Else = never> = F extends (
  arg: infer A,
  ...overloads: infer R
) => any
  ? A
  : Else
type Find<T, K extends keyof any, Else = never> = K extends keyof T
  ? T[K]
  : Else
type LaxReturnType<F> = F extends (...args: any) => infer R ? R : never
type FirstReturned<Functions extends AnyFunction[]> = Functions extends [
  infer First,
  ...any[],
]
  ? LaxReturnType<First>
  : never

interface YobtaCompose {
  <Functions extends [AnyFunction, ...AnyFunction[]]>(
    ...functions: Functions & Compose<Functions>
  ): (
    input: ArgType<Last<Functions>>,
    ...overloads: Overloads<Functions>
  ) => FirstReturned<Functions>
}

/**
 * Composes a list of functions into a single function.
 *
 * @example
 * const composed = composeYobta(functionA, functionB, ...functionN[])
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/composeYobta/index.md}
 */
export const composeYobta: YobtaCompose = (...yobtas) => {
  if (yobtas.length === 0) return (arg: any) => arg
  if (yobtas.length === 1) return yobtas[0]
  return yobtas.reduce(
    (a, b) =>
      (input, ...overloads) =>
        a(b(input, ...overloads), ...overloads),
  )
}
