// region types
type AnyParams = Record<string, string>
type AnyData = any // eslint-disable-line @typescript-eslint/no-explicit-any
type AnyOverloads = AnyData[]

type SplitString<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...SplitString<U, D>]
  : [S]

type PathToParams<PathArray, Params = {}> = PathArray extends [
  infer First,
  ...infer Rest,
]
  ? First extends `:${infer Param}`
    ? // eslint-disable-next-line @typescript-eslint/no-shadow
      First extends `:${infer Param}?`
      ? PathToParams<Rest, Params & Partial<Record<Param, string>>>
      : PathToParams<Rest, Params & Record<Param, string>>
    : PathToParams<Rest, Params>
  : Params

type ParseUrl<Path extends string> = PathToParams<SplitString<Path, '/'>>
type ParsedRoute = [regex: RegExp, names: string[]]

export type YobtaRouterCallback<
  Params extends AnyParams,
  Data extends AnyData,
  Overloads extends AnyOverloads,
> = (params: Params, data: Data, ...overloads: Overloads) => void

type Converter = (path: string) => AnyParams | undefined

type MatcherItem<Data extends AnyData, Overloads extends AnyOverloads> = {
  callbacks: Set<YobtaRouterCallback<AnyParams, Data, Overloads>>
  convert: Converter
  route: string
}

type MatchersMap<Data extends AnyData, Overloads extends AnyOverloads> = Map<
  string,
  MatcherItem<Data, Overloads>
>

interface RouterFactory {
  <Data extends AnyData, Overloads extends AnyOverloads>(): {
    subscribe<Path extends string>(
      path: Path,
      callback: YobtaRouterCallback<ParseUrl<Path>, Data, Overloads>,
    ): VoidFunction
    publish(path: string, data: Data, ...overloads: Overloads): boolean
  }
}
// endregion

export const prepareInput = (input: string): string =>
  input.trim().replace(/\/$/g, '') || '/'

export const parseRoute = (route: string): ParsedRoute => {
  let template = prepareInput(route)
  let names = (template.match(/\/:\w+/g) || []).map(match => match.slice(2))
  let pattern = template
    .replace(/[\s!#$()+,.:<=?[\\\]^{|}]/g, '\\$&')
    .replace(/\/\\:\w+\\\?/g, '/?([^/]*)')
    .replace(/\/\\:\w+/g, '/([^/]+)')
  let regex = RegExp('^' + pattern + '$', 'i')

  return [regex, names]
}

const createConverter =
  ([regex, names]: ParsedRoute): Converter =>
  rawPath => {
    let path = prepareInput(rawPath)
    if (!names.length) {
      return regex.test(path) ? {} : undefined
    }
    return prepareInput(path)
      .match(regex)
      ?.slice(1)
      .reduce((params, match, index) => {
        params[names[index]] = decodeURIComponent(match.toLowerCase())
        return params
      }, {} as AnyParams)
  }

export const createRouter: RouterFactory = <
  Data extends AnyData,
  Overloads extends AnyOverloads,
>() => {
  let matchersMap: MatchersMap<Data, Overloads> = new Map()
  return {
    subscribe(
      route,
      callback: YobtaRouterCallback<ParseUrl<typeof route>, Data, Overloads>,
    ) {
      let anyCallback = callback as YobtaRouterCallback<
        AnyParams,
        Data,
        Overloads
      >
      let parsedRoute = parseRoute(route)
      let key = `${parsedRoute[0].toString()}_${parsedRoute[1].join('_')}`
      let item = matchersMap.get(key) || {
        callbacks: new Set(),
        convert: createConverter(parsedRoute),
        route,
      }
      item.callbacks.add(anyCallback)
      matchersMap.set(key, item)

      return () => {
        matchersMap.get(key)?.callbacks.delete(anyCallback)
      }
    },
    publish(path, data: Data, ...overloads: Overloads) {
      let matchedCallbacks = new Set<{
        callback: YobtaRouterCallback<AnyParams, Data, Overloads>
        params: AnyParams | undefined
      }>()
      matchersMap.forEach(({ callbacks, convert }) => {
        let params = convert(path)
        if (params) {
          callbacks.forEach(callback => {
            matchedCallbacks.add({
              callback,
              params,
            })
          })
        }
      })
      matchedCallbacks.forEach(({ callback, params }) => {
        callback(params!, data, ...overloads)
      })
      return matchedCallbacks.size > 0
    },
  }
}
