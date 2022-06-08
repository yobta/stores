import { replicatedYobta } from './index.js'
import { localStorageYobta } from '../localStorageYobta/index.js'

let lastSpy = vi.fn()
let nextSpy = vi.fn()

afterEach(() => {
  localStorage.clear()
})

describe('replicatedYobta', () => {
  it('calls next when starts', () => {
    let replica = replicatedYobta({
      channel: 'test',
      backend: localStorageYobta,
    })

    replica({
      initialState: 'one',
      last: lastSpy,
      next: nextSpy,
      type: 'START',
    })

    expect(nextSpy).toHaveBeenCalledTimes(1)
    expect(nextSpy).toHaveBeenCalledWith(null)
  })

  it('calls last when receives a NEXT event', () => {
    let replica = replicatedYobta({
      channel: 'test',
      backend: localStorageYobta,
    })

    replica({
      initialState: 'one',
      last: lastSpy,
      next: nextSpy,
      type: 'NEXT',
    })

    expect(lastSpy).toHaveBeenCalledTimes(1)
    expect(lastSpy).toHaveBeenCalledWith()
  })

  it('validates remote value', () => {
    let validate = vi.fn()

    let replica = replicatedYobta({
      channel: 'test',
      validate,
      backend: localStorageYobta,
    })

    replica({
      initialState: 'one',
      last: lastSpy,
      next: nextSpy,
      type: 'START',
    })

    expect(nextSpy).toHaveBeenCalledTimes(1)
    expect(validate).toHaveBeenCalledTimes(1)
    expect(validate).toHaveBeenCalledWith(null)
  })

  it('replicates changes', () => {
    let publish = vi.fn()
    let subscribe = vi.fn()
    let unsubscribe = vi.fn()

    let backend = {
      publish,
      subscribe(...args: any[]) {
        subscribe(...args)
        return unsubscribe
      },
    }

    let replica = replicatedYobta({ channel: 'test', backend })

    replica({
      initialState: 'one',
      last: lastSpy,
      next: nextSpy,
      type: 'START',
    })

    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(subscribe).toHaveBeenCalledWith('test', expect.any(Function))

    replica({
      initialState: 'one',
      last: () => 'two',
      next: nextSpy,
      type: 'NEXT',
    })

    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(publish).toHaveBeenCalledTimes(1)
    expect(publish).toHaveBeenCalledWith('test', 'two')

    replica({
      initialState: 'one',
      last: lastSpy,
      next: nextSpy,
      type: 'STOP',
    })

    expect(subscribe).toHaveBeenCalledTimes(1)
    expect(publish).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
