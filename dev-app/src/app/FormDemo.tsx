'use client'
import type { FunctionComponent } from 'react'
import { revalidateTag } from 'next/cache'

import { createStore } from '../../../lib'
import { createHookFromStore } from '../../../lib/adapters/react'

type Place = {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
}

type Data = Place[]

const store = createStore<Data>([])
const useData = createHookFromStore(store)

const deleteItem = (id: number) => {
  const last = store.last()
  const next = last.filter(({ place_id }) => place_id !== id)
  store.next(next)
}

export const FormDemo: FunctionComponent<{ serverState: Data }> = ({
  serverState,
}) => {
  const items = useData({ serverState })
  return (
    <ul className="yobta-list">
      {items.map(({ place_id, display_name }) => (
        <li className="yobta-list-item" key={place_id}>
          {display_name}
          <button className="yobta-button" onClick={() => deleteItem(place_id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
