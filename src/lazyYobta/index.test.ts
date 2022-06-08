import { jest } from '@jest/globals'

import { lazyYobta } from './index.js'

describe('lazyYobta', () => {
  let next = jest.fn()

  it('resets state when event is STOP', () => {
    lazyYobta({
      initialState: 0,
      next,
      type: 'STOP',
      last: () => 1,
    })

    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(0)
  })

  it("doesn't reset state when event is not STOP", () => {
    lazyYobta({
      initialState: 0,
      next,
      type: 'START',
      last: () => 1,
    })

    expect(next).toHaveBeenCalledTimes(0)
  })
})
