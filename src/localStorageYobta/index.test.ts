import { jest } from '@jest/globals'

import { localStorageYobta } from '.'

afterEach(() => {
  localStorage.clear()
})

describe('localStorageYobta', () => {
  it('subscribes and unsubscibes', () => {
    jest.spyOn(window, 'addEventListener')
    jest.spyOn(window, 'removeEventListener')

    let unsubscribe = localStorageYobta.subscribe('test', () => {})

    expect(window.addEventListener).toHaveBeenCalledTimes(1)
    expect(window.addEventListener).toHaveBeenCalledWith(
      'storage',
      expect.any(Function),
    )

    unsubscribe()

    expect(window.addEventListener).toHaveBeenCalledTimes(1)
    expect(window.removeEventListener).toHaveBeenCalledTimes(1)
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'storage',
      expect.any(Function),
    )
  })

  it('writes changes in local storage', () => {
    localStorageYobta.publish('test', 1)

    let result = localStorage.getItem('test')

    expect(result).toBe('1')
  })

  it('listens to the storage updates', () => {
    let subscriber = jest.fn()
    expect(subscriber).toHaveBeenCalledTimes(0)

    localStorageYobta.subscribe('yobta', subscriber)
    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber).toHaveBeenCalledWith(null)

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'yobta',
        newValue: JSON.stringify('yobta'),
      }),
    )

    expect(subscriber).toHaveBeenCalledTimes(2)
    expect(subscriber).toHaveBeenLastCalledWith('yobta')
  })
})
