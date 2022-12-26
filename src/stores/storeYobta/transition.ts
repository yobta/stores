import { composeYobta } from '../../util/composeYobta/index.js'
import {
  YobtaStateSetter,
  YobtaStoreEvent,
  YobtaStoreMiddleware,
  YobtaStorePlugin,
} from './index.js'

interface TransitionFactory {
  <State>(config: Props<State>): (
    action: YobtaStoreEvent,
    state: State,
    ...overloads: any[]
  ) => State
}

type Props<State> = {
  initialState: State
  next: YobtaStateSetter<State>
  last(): State
  plugins: YobtaStorePlugin<State>[]
}

export const createTransition: TransitionFactory = <State>({
  initialState,
  last,
  next,
  plugins,
}: Props<State>) => {
  let middlewares: Record<YobtaStoreEvent, YobtaStoreMiddleware<State>[]> = {
    ready: [],
    idle: [],
    next: [],
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

  let transitions = {
    ready: composeYobta(
      ...(middlewares.ready as [YobtaStoreMiddleware<State>]),
    ),
    idle: composeYobta(...(middlewares.idle as [YobtaStoreMiddleware<State>])),
    next: composeYobta(...(middlewares.next as [YobtaStoreMiddleware<State>])),
  }

  return (action, state: State, ...overloads) => {
    let transition = transitions[action]
    return transition(state, ...overloads)
  }
}
