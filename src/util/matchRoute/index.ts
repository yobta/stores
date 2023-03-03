import { parseRoute, prepareInput } from '../createRouter/index.js'

interface MatchRoute {
  (route: string, path: string): boolean
}

export const matchRoute: MatchRoute = (route, path) => {
  let [regex] = parseRoute(route)
  return regex.test(prepareInput(path))
}
