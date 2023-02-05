import { composeYobta } from '../../util/composeYobta/index.js'
import {
  YobtaStateSetter,
  YobtaStoreMiddleware,
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from './index.js'

type Props<State, Overloads extends any[]> = {
  initialState: State
  next: YobtaStateSetter<State, Overloads>
  last(): State
  plugins: YobtaStorePlugin<State, Overloads>[]
}
type Middlewares<State> = {
  [YOBTA_READY]: YobtaStoreMiddleware<State, any>[]
  [YOBTA_IDLE]: YobtaStoreMiddleware<State, any>[]
  [YOBTA_NEXT]: YobtaStoreMiddleware<State, any>[]
}
interface MiddlewareFactory {
  <State, Overloads extends any[]>(config: Props<State, Overloads>): {
    [YOBTA_READY]: YobtaStoreMiddleware<State, any>
    [YOBTA_IDLE]: YobtaStoreMiddleware<State, any>
    [YOBTA_NEXT]: YobtaStoreMiddleware<State, Overloads>
  }
}

export const composeMiddleware: MiddlewareFactory = <
  State,
  Overloads extends any[],
>({
  initialState,
  last,
  next,
  plugins,
}: Props<State, Overloads>) => {
  let middlewares: Middlewares<State> = {
    [YOBTA_READY]: [],
    [YOBTA_IDLE]: [],
    [YOBTA_NEXT]: [],
  }
  plugins.forEach((plugin: YobtaStorePlugin<State, Overloads>): void => {
    plugin({
      addMiddleware(type, middleware) {
        middlewares[type].push(middleware as any)
      },
      initialState,
      next,
      last,
    })
  })
  return {
    ready: composeYobta(
      ...(middlewares.ready as [YobtaStoreMiddleware<State, any[]>]),
    ),
    idle: composeYobta(
      ...(middlewares.idle as [YobtaStoreMiddleware<State, any[]>]),
    ),
    next: composeYobta(
      ...(middlewares.next as [YobtaStoreMiddleware<State, any[]>]),
    ),
  }
}
