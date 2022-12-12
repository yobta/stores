import { useState } from 'react'
import './App.css'

import {
  broadcastChannelPluginYobta,
  localStoragePluginYobta,
  mapEncoderYobta,
  mapYobta,
  observableYobta,
  sessionStoragePluginYobta,
} from '../../src'
import { useObservable } from '../../src/adapters/react'

const mapStore = mapYobta<{ a?: number }>(
  {},
  localStoragePluginYobta({ channel: 'counter', encoder: mapEncoderYobta }),
)

const stringStore = observableYobta(
  '',
  sessionStoragePluginYobta({ channel: 'test' }),
)

const plainStore = observableYobta(
  {},
  broadcastChannelPluginYobta({ channel: 'plain' }),
)

const up = () => {
  mapStore.assign({ a: (mapStore.last().get('a') || 0) + 1 })
}
const down = () => mapStore.omit(['a'])

function App() {
  const count = useObservable(mapStore)
  const plain = useObservable(plainStore)
  console.log('plain: ', plain)
  const str = useObservable(stringStore)

  return (
    <div className="App">
      count: {count.get('a') || 0}
      <br />
      <button onClick={down}>Down</button>
      <button onClick={up}>Up</button>
      <input
        value={str}
        onChange={event => stringStore.next(event.target.value)}
      />
      <hr />
      <button
        onClick={() => {
          plainStore.next({ a: Date.now() })
        }}
      >
        piu
      </button>
    </div>
  )
}

export default App
