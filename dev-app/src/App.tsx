import './App.css'

import { createStore, createDerivedStore } from '../../src'
import { useStore } from '../../src/adapters/react'
import { useEffect } from 'react'
import { useRef } from 'react'

const store = createStore(0)
const added = createDerivedStore(value => value + 1, store)
const subtracted = createDerivedStore(value => value - 1, store)
const total = createDerivedStore((v1, v2) => v1 + v2, added, subtracted)
const edge = createDerivedStore(v => v + v, total)

const up = () => {
  let next = store.last() + 1
  store.next(next)
}
const down = () => {
  let next = store.last() - 1
  store.next(next)
}

function App() {
  const count = useStore(store)
  const addedCount = useStore(added)
  const subtractedCount = useStore(subtracted)
  const totalValue = useStore(total, { getServerSnapshot: () => 5 })
  const edgeValue = useStore(edge)
  const ref = useRef(0)
  useEffect(() => {
    return edge.observe(next => {
      console.log('next:', next)
    })
  }, [])
  useEffect(() => {
    ref.current++
  })
  return (
    <div className="App">
      count: {count} | {store.last()}
      <div style={{ display: 'flex', gap: 24, padding: 16 }}>
        <div style={{ width: '10em', textAlign: 'right' }}>
          add 1: {addedCount} | {added.last()}
        </div>
        <div style={{ width: '10em' }}>
          subtract 1: {subtractedCount} | {subtracted.last()}
        </div>
      </div>
      total: {totalValue} | {total.last()}
      <hr />
      edge: {edgeValue} | {edge.last()}
      <hr />
      update count: {ref.current}
      <br />
      <br />
      <button onClick={down}>Down</button>
      <button onClick={up}>Up</button>
    </div>
  )
}

export default App
