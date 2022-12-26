import { YobtaStorePlugin } from './index.js'
import { createTransition } from './transition.js'
import { composeYobta } from '../../util/composeYobta/index.js'

const middleWareMock = vi.fn((state: any) => state)
vi.mock('../../util/composeYobta/index.js', () => ({
  composeYobta: vi.fn(() => middleWareMock),
}))

it('should return a function', () => {
  let returnedFunction = createTransition({
    initialState: {},
    last: vi.fn(() => ({})),
    next: vi.fn((state: any) => state),
    plugins: [],
  })
  expect(typeof returnedFunction).toEqual('function')
})

it('should call composeYobta with the correct middlewares for each event type', () => {
  let mockReadyMiddleware = vi.fn((state: any) => state)
  let mockIdleMiddleware = vi.fn((state: any) => state)
  let mockNextMiddleware = vi.fn((state: any) => state)
  let mockPlugins: YobtaStorePlugin<{}>[] = [
    props => {
      props.addMiddleware('ready', mockReadyMiddleware)
      props.addMiddleware('idle', mockIdleMiddleware)
      props.addMiddleware('next', mockNextMiddleware)
    },
  ]
  createTransition({
    initialState: {},
    last: vi.fn(() => ({})),
    next: vi.fn((state: any) => state),
    plugins: mockPlugins,
  })
  expect(composeYobta).toHaveBeenCalledWith(mockReadyMiddleware)
  expect(composeYobta).toHaveBeenCalledWith(mockIdleMiddleware)
  expect(composeYobta).toHaveBeenCalledWith(mockNextMiddleware)
})

it('should call the correct transition function based on the provided action', () => {
  let transition = createTransition({
    initialState: 'yobta',
    last: vi.fn(() => ({})),
    next: vi.fn((state: any) => state),
    plugins: [],
  })
  transition('ready', 'yobta-ready')
  expect(middleWareMock).toHaveBeenCalledWith('yobta-ready')
  transition('idle', 'yobta-idle')
  expect(middleWareMock).toHaveBeenCalledWith('yobta-idle')
  transition('next', 'yobta-next')
  expect(middleWareMock).toHaveBeenCalledWith('yobta-next')
})
