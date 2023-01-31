import { useState } from 'react'
import './App.css'

import {
  broadcastChannelPluginYobta,
  localStoragePluginYobta,
  mapCodecYobta,
  mapYobta,
  storeYobta,
  sessionStoragePluginYobta,
} from '../../src'
import { useYobta } from '../../src/adapters/react'

const mapStore = mapYobta<{ a: number }>(
  { a: 0 },
  localStoragePluginYobta({ channel: 'counter', codec: mapCodecYobta }),
)

const stringStore = storeYobta(
  '',
  sessionStoragePluginYobta({ channel: 'test' }),
)

const plainStore = storeYobta(
  {},
  broadcastChannelPluginYobta({ channel: 'plain' }),
)

const up = () => {
  mapStore.assign({ a: (mapStore.last().get('a') || 0) + 1 })
}
const down = () => mapStore.omit(['a'])

function App() {
  const count = useYobta(mapStore)
  const plain = useYobta(plainStore)
  console.log('plain: ', plain)
  const str = useYobta(stringStore)

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
