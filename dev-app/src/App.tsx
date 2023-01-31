import { useState } from 'react'
import './App.css'

import { storeYobta, derrivedYobta } from '../../src'
import { useYobta } from '../../src/adapters/react'
import { useEffect } from 'react'

const store = storeYobta(0)
const added = derrivedYobta(value => value + 1, store)
const subtracted = derrivedYobta(value => value - 1, store)
const total = derrivedYobta((v1, v2) => v1 + v2, added, subtracted)

const up = () => {
  let next = store.last() + 1
  store.next(next)
}
const down = () => {
  let next = store.last() - 1
  store.next(next)
}

function App() {
  const addedCount = useYobta(added)
  const subtractedCount = useYobta(subtracted)
  const totalValue = useYobta(total)
  useEffect(() => {
    console.log('rendered')
  })
  return (
    <div className="App">
      {/* count: {count} */}
      <br />
      add 1: {addedCount}
      <br />
      subtract 1: {subtractedCount}
      <br />
      total: {totalValue}
      <hr />
      <button onClick={down}>Down</button>
      <button onClick={up}>Up</button>
    </div>
  )
}

export default App
