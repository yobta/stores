import { YobtaJsonValue } from '../../util/jsonCodec/index.js'
import { YobtaReadable } from '../../util/readable/index.js'
import { createStore } from '../createStore/index.js'

// #region types
type Id = string | number
type Key = string | number
type AnySnapshot = { id: Id; [key: Key]: YobtaJsonValue | undefined }
type Versions<Snapshot extends AnySnapshot> = {
  [K in keyof Snapshot]: number
}
type PatchWithoutId<Snapshot extends AnySnapshot> = Partial<
  Omit<Snapshot, 'id'>
>
type PatchWithId<Snapshot extends AnySnapshot> = PatchWithoutId<Snapshot> & {
  id: Id
}

export type InsertOperation<Snapshot extends AnySnapshot> = {
  id: string
  type: 'insert'
  data: Snapshot
  ref: Id
  version: number
}
export type UpdateOperation<Snapshot extends AnySnapshot> = {
  id: string
  type: 'update'
  data: PatchWithoutId<Snapshot>
  ref: Id
  version: number
}
type CollectionOperation<
  Snapshot extends AnySnapshot,
  Patched extends AnySnapshot = PatchWithId<Snapshot>,
> = InsertOperation<Snapshot> | UpdateOperation<Patched>

type ResultingSnapshot<Snapshot extends AnySnapshot> =
  | Readonly<Snapshot>
  | undefined
type InternalState<Snapshot extends AnySnapshot> = Map<
  Id,
  ItemWithMeta<Snapshot>
>
type ItemWithMeta<
  Snapshot extends AnySnapshot,
  PartialSnapshot extends AnySnapshot = PatchWithId<Snapshot>,
> = [
  PartialSnapshot,
  Versions<PartialSnapshot>,
  ...CollectionOperation<Snapshot>[],
]

interface CollectionFactory {
  <Snapshot extends AnySnapshot>(name: string): {
    commit(operation: CollectionOperation<Snapshot>): void
    merge(...operations: CollectionOperation<Snapshot>[]): void
    // insert(id: Id, snapshot: Snapshot): void
    // update(id: Id, patch: Patch<Snapshot>): void
    get(id: Id): ResultingSnapshot<Snapshot>
    last(): InternalState<Snapshot>
  } & YobtaReadable<InternalState<Snapshot>>
}
// #endregion

export const getOrCreateItem = <Snapshot extends AnySnapshot>(
  state: InternalState<Snapshot>,
  id: Id,
): ItemWithMeta<Snapshot> => {
  let item = state.get(id)
  if (!item) {
    item = [{ id } as Snapshot, { id: 0 } as Versions<Snapshot>]
  }
  return item
}

export const applyOperation = <Snapshot extends AnySnapshot>(
  [snapshot, versions, ...pendingOperations]: ItemWithMeta<Snapshot>,
  operation: CollectionOperation<Snapshot>,
): ItemWithMeta<Snapshot> => {
  let nextSnapshot = { ...snapshot } as AnySnapshot
  let nextVersions = { ...versions } as Versions<AnySnapshot>
  for (let key in operation.data) {
    if (operation.version > (versions[key] || 0)) {
      nextSnapshot[key] = operation.data[key]
      nextVersions[key] = operation.version
    }
  }
  let nextPendingOperations = pendingOperations.filter(
    ({ id }) => id !== operation.id,
  )
  let nextItem: ItemWithMeta<Snapshot> = [
    nextSnapshot as Snapshot,
    nextVersions as Versions<Snapshot>,
    ...nextPendingOperations,
  ]
  return nextItem
}

export const createCollection: CollectionFactory = <
  Snapshot extends AnySnapshot,
>(
  name,
) => {
  let { last, next, observe, on } = createStore<InternalState<Snapshot>>(
    new Map(),
  )
  let getState = (): InternalState<Snapshot> => new Map(last())
  let commit = (operation: CollectionOperation<Snapshot>): void => {
    let state = getState()
    let item = getOrCreateItem(state, operation.ref)
    if (!item.slice(2).some(({ id }) => id === operation.id)) {
      state.set(operation.ref, [...item, operation])
      next(state)
    }
  }
  let merge = (...operations: CollectionOperation<Snapshot>[]): void => {
    let state = getState()
    for (let operation of operations) {
      let item = getOrCreateItem(state, operation.ref)
      let nextItem = applyOperation(item, operation)
      state.set(operation.ref, nextItem)
    }
    next(state)
  }
  let get = (id: Id): ResultingSnapshot<Snapshot> => {
    let item = last().get(id)
    if (!item) return undefined
    let [snapshot, versions, ...operations] = item
    let [resultingSnapshot, resultingVersions] = operations.reduce<
      ItemWithMeta<Snapshot>
    >(applyOperation, [snapshot, versions])
    return resultingVersions.id
      ? (resultingSnapshot as ResultingSnapshot<Snapshot>)
      : undefined
  }
  return {
    commit,
    merge,
    get,
    last,
    observe,
    on,
  }
}
