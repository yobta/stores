import {
  createCollection,
  applyOperation,
  InsertOperation,
  UpdateOperation,
} from '.'

type Snapshot = {
  id: string
  name: string
}

describe('getOrCreateItem', () => {
  it('should create item if it does not exist', () => {
    let collection = createCollection<Snapshot>('test')
    let item = collection.get('item-1')
    let mockState = new Map()
    expect(item).toBeUndefined()
    expect(collection.last()).toEqual(mockState)
  })
  it('should get item if it exists', () => {
    let collection = createCollection<Snapshot>('test')
    collection.merge({
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    })
    let item = collection.get('item-1')
    expect(item).toEqual({ id: 'item-1', name: 'test' })
  })
})
describe('applyOperation', () => {
  it('should apply insert operation', () => {
    let item = applyOperation([{ id: 'item-1' }, { id: 0 }], {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    })
    expect(item).toEqual([
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ])
  })
  it('should apply update operation', () => {
    let item = applyOperation(
      [
        { id: 'item-1', name: 'test' },
        { id: 1, name: 1 },
      ],
      {
        id: 'op-2',
        type: 'update',
        data: { name: 'test2' },
        ref: 'item-1',
        version: 2,
      },
    )
    expect(item).toEqual([
      { id: 'item-1', name: 'test2' },
      { id: 1, name: 2 },
    ])
  })
  it('should not mutate item', () => {
    let item = [
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ]
    let nextItem = applyOperation(item as any, {
      id: 'op-2',
      type: 'update',
      data: { name: 'test2' },
      ref: 'item-1',
      version: 2,
    })
    expect(item).not.toBe(nextItem)
  })
  it('should not mutate versions', () => {
    let item = [
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ]
    let nextItem = applyOperation(item as any, {
      id: 'op-2',
      type: 'update',
      data: { name: 'test2' },
      ref: 'item-1',
      version: 2,
    })
    expect(item).not.toBe(nextItem)
  })
  it('should remove pending operation', () => {
    let operation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test2' },
      ref: 'item-1',
      version: 2,
    }
    let operation2: UpdateOperation<Snapshot> = {
      id: 'op-3',
      type: 'update',
      data: { name: 'test3' },
      ref: 'item-1',
      version: 3,
    }
    let item = applyOperation(
      [
        { id: 'item-1', name: 'test' },
        { id: 1, name: 1 },
        operation,
        operation2,
      ],
      operation,
    )
    expect(item).toEqual([
      { id: 'item-1', name: 'test2' },
      { id: 1, name: 2 },
      operation2,
    ])
  })
})
describe('merge', () => {
  it('should merge insert operation', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    collection.merge(insertOperation)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test' })
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should merge multiple insert operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation1: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let insertOperation2: InsertOperation<Snapshot> = {
      id: 'op-2',
      type: 'insert',
      data: { id: 'item-2', name: 'test' },
      ref: 'item-2',
      version: 2,
    }
    collection.merge(insertOperation1, insertOperation2)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test' })
    expect(collection.get('item-2')).toEqual({ id: 'item-2', name: 'test' })
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ])
    mockState.set('item-2', [
      { id: 'item-2', name: 'test' },
      { id: 2, name: 2 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should merge update operation', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: UpdateOperation<Snapshot> = {
      id: 'op-1',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 1,
    }
    collection.merge(insertOperation)
    expect(collection.get('item-1')).toBeUndefined()
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test 2' },
      { id: 0, name: 1 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should merge multiple update operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation1: UpdateOperation<Snapshot> = {
      id: 'op-1',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 1,
    }
    let insertOperation2: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 3' },
      ref: 'item-1',
      version: 2,
    }
    collection.merge(insertOperation1, insertOperation2)
    expect(collection.get('item-1')).toBeUndefined()
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test 3' },
      { id: 0, name: 2 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should merge insert and update operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.merge(insertOperation, updateOperation)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test 2' },
      { id: 1, name: 2 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should merge update and insert operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.merge(updateOperation, insertOperation)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test 2' },
      { id: 1, name: 2 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('is idimpotent', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.merge(insertOperation, updateOperation, insertOperation)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test 2' },
      { id: 1, name: 2 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
  it('should not mutate state', () => {
    let collection = createCollection<Snapshot>('test')
    let state = collection.last()
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    collection.merge(insertOperation)
    expect(collection.last()).not.toBe(state)
  })
  it('sould remove pending operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    collection.commit(insertOperation)
    collection.merge(insertOperation)
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1', name: 'test' },
      { id: 1, name: 1 },
    ])
    expect(collection.last()).toEqual(mockState)
  })
})
describe('commit', () => {
  it('should commit insert operation', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    collection.commit(insertOperation)
    let mockState = new Map()
    mockState.set('item-1', [{ id: 'item-1' }, { id: 0 }, insertOperation])
    expect(collection.last()).toEqual(mockState)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test' })
  })
  it('should commit update operation', () => {
    let collection = createCollection<Snapshot>('test')
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.commit(updateOperation)
    let mockState = new Map()
    mockState.set('item-1', [{ id: 'item-1' }, { id: 0 }, updateOperation])
    expect(collection.last()).toEqual(mockState)
    expect(collection.get('item-1')).toBeUndefined()
  })
  it('sould commit insert and update operations', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.commit(insertOperation)
    collection.commit(updateOperation)
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1' },
      { id: 0 },
      insertOperation,
      updateOperation,
    ])
    expect(collection.last()).toEqual(mockState)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
  })
  it('should commit insert and update operations in reverse order', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.commit(updateOperation)
    collection.commit(insertOperation)
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1' },
      { id: 0 },
      updateOperation,
      insertOperation,
    ])
    expect(collection.last()).toEqual(mockState)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
  })
  it('should be idempotent', () => {
    let collection = createCollection<Snapshot>('test')
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    let updateOperation: UpdateOperation<Snapshot> = {
      id: 'op-2',
      type: 'update',
      data: { name: 'test 2' },
      ref: 'item-1',
      version: 2,
    }
    collection.commit(insertOperation)
    collection.commit(updateOperation)
    collection.commit(insertOperation)
    collection.commit(updateOperation)
    let mockState = new Map()
    mockState.set('item-1', [
      { id: 'item-1' },
      { id: 0 },
      insertOperation,
      updateOperation,
    ])
    expect(collection.last()).toEqual(mockState)
    expect(collection.get('item-1')).toEqual({ id: 'item-1', name: 'test 2' })
  })
  it('should not mutate state', () => {
    let collection = createCollection<Snapshot>('test')
    let state = collection.last()
    let insertOperation: InsertOperation<Snapshot> = {
      id: 'op-1',
      type: 'insert',
      data: { id: 'item-1', name: 'test' },
      ref: 'item-1',
      version: 1,
    }
    collection.commit(insertOperation)
    expect(collection.last()).not.toBe(state)
  })
})
