import { useState } from 'react'
import './App.css'

import {
  broadcastChannelPlugin,
  localStoragePlugin,
  mapCodec,
  createMapStore,
  createStore,
  sessionStoragePlugin,
} from '../../src'
import { useStore } from '../../src/adapters/react'

const mapStore = createMapStore<{ a: number }>(
  { a: 0 },
  localStoragePlugin({ channel: 'counter', codec: mapCodec }),
)

const stringStore = createStore('', sessionStoragePlugin({ channel: 'test' }))

const plainStore = createStore({}, broadcastChannelPlugin({ channel: 'plain' }))

const up = () => {
  mapStore.assign({ a: (mapStore.last().get('a') || 0) + 1 })
}
const down = () => mapStore.omit(['a'])

function App() {
  const count = useStore(mapStore)
  const plain = useStore(plainStore)
  console.log('plain: ', plain)
  const str = useStore(stringStore)

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
