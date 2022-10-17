import { useState } from 'react'
import './App.css'

import { localStoragePluginYobta, observableYobta } from '../../src'
import { useObservable } from '../../src/adapters/react'

const store = observableYobta(1, localStoragePluginYobta({ channel: 'test' }))

const up = () => store.next(value => value + 1)
const down = () => store.next(value => value - 1)

function App() {
  const count = useObservable(store)

  return (
    <div className="App">
      count: {count}
      <br />
      <button onClick={down}>Down</button>
      <button onClick={up}>Up</button>
    </div>
  )
}

export default App
