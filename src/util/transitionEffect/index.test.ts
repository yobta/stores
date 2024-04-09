import { YOBTA_BEFORE } from '../../stores/createStore/index.js'
import { transitionEffect } from './index.js'

const onMock = vi.fn()
const offMock = vi.fn()
const mockStore = {
  last(): number {
    return 1
  },
  on(...args: any[]) {
    onMock(...args)
    return offMock
  },
}
const mockEffect = vi.fn()

it('returns a function', () => {
  const effect = transitionEffect(mockStore, 1 as number, mockEffect)
  expect(effect).toEqual(expect.any(Function))
})

it('subscribes to store', () => {
  transitionEffect(mockStore, 1 as number, mockEffect)
  expect(onMock).toHaveBeenCalledWith(YOBTA_BEFORE, expect.any(Function))
})

it('calls effect when state is changed', () => {
  transitionEffect(mockStore, 2 as number, mockEffect)
  onMock.mock.calls[0][1](2)
  expect(mockEffect).toHaveBeenCalled()
})

it('does not call effect when state is not changed', () => {
  transitionEffect(mockStore, 1 as number, mockEffect)
  onMock.mock.calls[0][1](2)
  expect(mockEffect).not.toHaveBeenCalled()
})

it('unsubscribes from store', () => {
  const unsubscribe = transitionEffect(mockStore, 1 as number, mockEffect)
  unsubscribe()
  expect(offMock).toHaveBeenCalled()
})
