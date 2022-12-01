import { machineYobta } from './index.js'

it('has default state', () => {
  let store = machineYobta({
    one: new Set(['two']),
    two: new Set(['one']),
  })('one')
  expect(store.last()).toEqual('one')
})

it('sets next state', () => {
  let store = machineYobta({
    one: new Set(['two']),
    two: new Set(['one']),
  })('one')
  store.next('two')
  expect(store.last()).toEqual('two')
})

it('takes next as a funscrion', () => {
  let store = machineYobta({
    one: new Set(['two']),
    two: new Set(['one']),
  })('one')
  store.next(() => 'two')
  expect(store.last()).toEqual('two')
})

it('ignores unexpected next state', () => {
  let store = machineYobta({
    one: new Set(['two']),
    two: new Set(['one']),
  })('one')
  store.next('three' as any)
  expect(store.last()).toEqual('one')
})
