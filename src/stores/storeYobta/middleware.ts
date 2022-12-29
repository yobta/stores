import { composeYobta } from '../../util/composeYobta/index.js'
import {
  YobtaStateSetter,
  YobtaStoreEvent,
  YobtaStoreMiddleware,
  YobtaStorePlugin,
  YOBTA_IDLE,
  YOBTA_NEXT,
  YOBTA_READY,
} from './index.js'

interface MiddlewareFactory {
  <State>(config: Props<State>): {
    ready: YobtaStoreMiddleware<State>
    idle: YobtaStoreMiddleware<State>
    next: YobtaStoreMiddleware<State>
  }
}
type Props<State> = {
  initialState: State
  next: YobtaStateSetter<State>
  last(): State
  plugins: YobtaStorePlugin<State>[]
}

export const composeMiddleware: MiddlewareFactory = <State>({
  initialState,
  last,
  next,
  plugins,
}: Props<State>) => {
  let middlewares: Record<YobtaStoreEvent, YobtaStoreMiddleware<State>[]> = {
    [YOBTA_READY]: [],
    [YOBTA_IDLE]: [],
    [YOBTA_NEXT]: [],
  }
  let mount = (plugin: YobtaStorePlugin<State>): void => {
    plugin({
      addMiddleware: (
        type: YobtaStoreEvent,
        middleware: YobtaStoreMiddleware<State>,
      ): void => {
        middlewares[type].push(middleware)
      },
      initialState,
      next,
      last,
    })
  }
  plugins.forEach(mount)
  return {
    ready: composeYobta(
      ...(middlewares.ready as [YobtaStoreMiddleware<State>]),
    ),
    idle: composeYobta(...(middlewares.idle as [YobtaStoreMiddleware<State>])),
    next: composeYobta(...(middlewares.next as [YobtaStoreMiddleware<State>])),
  }
}
