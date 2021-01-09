import { Client } from '@logux/client'
import { Action } from '@logux/core'

import {
  ClientLogStoreConstructor,
  ClientLogStore
} from '../client-log-store/index.js'
import { OptionalKeys, RejectKeys } from '../store/index.js'
import { loading, loaded } from '../remote-store/index.js'

export const lastProcessed: unique symbol
export const lastChanged: unique symbol
export const offline: unique symbol
export const unbind: unique symbol

export type MapDiff<O extends object> = {
  [K in Exclude<RejectKeys<O, Function | object>, keyof SyncMap>]?: O[K]
}

export type MapKey<O extends object> = Exclude<
  RejectKeys<O, Function | object>,
  keyof SyncMap
>

export type MapCreateAction<
  T extends string = '@logux/maps/create'
> = Action & {
  type: T
  values: {
    id: string
    [key: string]: string | number
  }
}

export type MapChangeAction<
  T extends string = '@logux/maps/change'
> = Action & {
  type: T
  id: string
  diff: {
    [key: string]: string | number
  }
}

export type MapChangedAction<
  T extends string = '@logux/maps/changed'
> = Action & {
  type: T
  id: string
  diff: {
    [key: string]: string | number
  }
}

export type MapDeleteAction<
  T extends string = '@logux/maps/delete'
> = Action & {
  type: T
  id: string
}

type RequiredFields<C extends object> = {
  [K in Exclude<
    Exclude<keyof C, Exclude<keyof SyncMap, 'id'>>,
    OptionalKeys<C>
  >]: C[K]
}

type OptionalFields<C extends object> = {
  [K in Exclude<OptionalKeys<C>, Exclude<keyof SyncMap, 'id'>>]?: C[K]
}

/**
 * CRDT LWW Map with server validation. The best option for classic case
 * with server and many clients. Store will resolve client’s edit conflicts
 * with last write wins strategy.
 *
 * ```ts
 * import { SyncMap } from '@logux/state'
 *
 * export class User extends SyncMap {
 *   static plural = 'users'
 *   readonly name!: string
 *   readonly login!: string
 * }
 * ```
 */
export abstract class SyncMap extends ClientLogStore {
  [loaded]: boolean;
  [loading]: Promise<void>

  /**
   * Should client load store from server and be ready
   * for `logux/undo` from server.
   */
  static remote: boolean

  /**
   * Should client keep offline cache for models in `localStorage`.
   *
   * ```js
   * import { SyncMap } from '@logux/state'
   *
   * export class Posts extends SyncMap {
   *   static offline = true;
   * }
   * ```
   */
  static offline?: boolean

  /**
   * Plural store name. It will be used in action type and channel name.
   *
   * ```js
   * export class User extends SyncMap {
   *   static plural = 'users'
   * }
   * ```
   */
  static plural: string

  /**
   * Create map instance.
   *
   * ```js
   * Post.create(client, {
   *   id: nanoid(),
   *   title: 'New post'
   * })
   * ```
   *
   * @param client Logux client.
   * @param fields Map’s key-values.
   */
  static create<C extends ClientLogStoreConstructor<SyncMap>> (
    this: C,
    client: Client,
    fields: RequiredFields<InstanceType<C>> & OptionalFields<InstanceType<C>>
  ): Promise<void>

  /**
   * Should client keep offline cache for this store instance in `localStorage`.
   *
   * ```js
   * import { offline } from '@logux/state'
   *
   * cachePost(() => {
   *   post[offline] = true
   * })
   * ```
   */
  [offline]?: boolean

  /**
   * Change the key in the store.
   *
   * ```js
   * showLoader()
   * await store.change({ name: 'New name' })
   * hideLoader()
   * ```
   *
   * @param key Store key.
   * @param value New value.
   * @returns Promise until change will be applied on the server.
   */
  change<K extends MapKey<this>> (key: K, value: this[K]): Promise<void>
  change (diff: MapDiff<this>): Promise<void>

  /**
   * Delete current map.
   *
   * ```js
   * post.delete()
   * ```
   */
  delete (): Promise<void>
}