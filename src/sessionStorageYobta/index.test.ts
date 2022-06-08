import { jest } from '@jest/globals'

import { sessionStorageYobta } from './index.js'

afterEach(() => {
  sessionStorage.clear()
})

describe('sessionStorageYobta', () => {
  it('subscribes and unsubscibes', () => {
    let spy = jest.fn()
    let unsubscribe = sessionStorageYobta.subscribe('test', spy)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(null)

    unsubscribe()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('writes changes in session storage', () => {
    sessionStorageYobta.publish('test', 1)

    let result = sessionStorage.getItem('test')

    expect(result).toBe('1')
  })
})
