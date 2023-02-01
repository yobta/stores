import './App.css'

import { storeYobta, derrivedYobta, YOBTA_NEXT, YOBTA_BEFORE } from '../../src'
import { useYobta } from '../../src/adapters/react'
import { useEffect } from 'react'

const store = storeYobta(0)
const added = derrivedYobta(value => value + 1, store)
const subtracted = derrivedYobta(value => value - 1, store)
const total = derrivedYobta((v1, v2) => v1 + v2, added, subtracted)
const edge = derrivedYobta(v => v + v, total)

const up = () => {
  let next = store.last() + 1
  store.next(next)
}
const down = () => {
  let next = store.last() - 1
  store.next(next)
}

function App() {
  const count = useYobta(store)
  const addedCount = useYobta(added)
  const subtractedCount = useYobta(subtracted)
  const totalValue = useYobta(total)
  const edgeValue = useYobta(edge)
  useEffect(() => {
    return edge.observe(next => {
      console.log('next:', next)
    })
  }, [])
  return (
    <div className="App">
      count: {count} | {store.last()}
      <br />
      add 1: {addedCount} | {added.last()}
      <br />
      subtract 1: {subtractedCount} | {subtracted.last()}
      <br />
      {/* total: {totalValue} | {total.last()} */}
      <hr />
      edge: {edgeValue} | {edge.last()}
      <hr />
      <button onClick={down}>Down</button>
      <button onClick={up}>Up</button>
    </div>
  )
}

export default App
