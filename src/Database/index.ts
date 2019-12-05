import * as sample from 'lodash.sample';
import * as first from 'lodash.first';
import * as last from 'lodash.last';
import * as filter from 'lodash.filter';

type DataType = any;

const databaseCollectionStores: WeakMap<
  Database<DatabaseSchema>,
  Map<any, Collection<DataType>>
> = new WeakMap();

export interface DatabaseSchema {
  [collectionName: string]: DataType; // <- DataType in Collection
}

export interface Collection<D extends DataType> {
  uuid: number;
  factory: DataFactory<D>;
  records: DataRecord<D>[];
}

export type DataFactory<D extends DataType> = () => D;

export type RecordId = number;

export interface DataRecord<D extends DataType> {
  id: RecordId;
  data: D;
}

export class Database<M extends DatabaseSchema> {
  constructor() {
    this.reset();
  }

  all<K extends keyof M>(collectionName: K): DataRecord<M[K]>[] {
    const { records } = this.getCollection(collectionName);
    return records;
  }

  belongsTo<K extends keyof M>(
    collectionName: K,
    conditions: Partial<M[K]>
  ): () => DataRecord<M[K]> | undefined {
    return () => {
      if (conditions) {
        return this.findOne(collectionName, conditions);
      } else {
        return sample(this.all(collectionName));
      }
    };
  }

  create<K extends keyof M>(
    collectionName: K,
    size: number = 1,
    factory?: DataFactory<M[K]>
  ): DataRecord<M[K]>[] {
    const dataFactory = factory || this.getCollection(collectionName).factory;
    const records = [];

    for (let index = 0; index < size; index++) {
      const data = dataFactory();
      const record = this.push(collectionName, data);
      records.push(record);
    }

    return records;
  }

  delete<K extends keyof M>(
    collectionName: K,
    id: RecordId
  ): DataRecord<M[K]> | null {
    const collection = this.getCollection(collectionName);
    const { records } = collection;
    const record = records.reduce((result: DataRecord<M[K]> | undefined, record) => record.id === id ? record : result, undefined);

    if (record) {
      const index = records.indexOf(record);
      records.splice(index, 1);
      return record;
    } else {
      return null;
    }
  }

  exists<K extends keyof M>(collectionName: K): boolean {
    const collectionStore = this.getCollectionStore();
    return !!collectionStore.get(collectionName);
  }

  find<K extends keyof M>(
    collectionName: K,
    conditions: Partial<M[K]>
  ): DataRecord<M[K]>[] {
    const { records } = this.getCollection(collectionName);
    return filter(records, { data: conditions }) as DataRecord<M[K]>[];
  }

  findOne<K extends keyof M>(
    collectionName: K,
    conditions: Partial<M[K]>
  ): DataRecord<M[K]> | undefined {
    return first(this.find(collectionName, conditions));
  }

  first<K extends keyof M>(collectionName: K): DataRecord<M[K]> | undefined {
    const { records } = this.getCollection(collectionName);
    return first(records);
  }

  last<K extends keyof M>(collectionName: K): DataRecord<M[K]> | undefined {
    const { records } = this.getCollection(collectionName);
    return last(records);
  }

  push<K extends keyof M>(
    collectionName: K,
    data: M[K]
  ): DataRecord<M[K]> {
    const collection = this.getCollection(collectionName);
    const { uuid, records } = collection;
    const record = {
      id: uuid,
      data
    };

    records.push(record);
    collection.uuid++;

    return record;
  }

  register<K extends keyof M>(
    collectionName: K,
    factory: DataFactory<M[K]>
  ) {
    const store = this.getCollectionStore();
    const collection: Collection<M[K]> = {
      uuid: 0,
      records: [],
      factory
    };

    store.set(collectionName, collection);
  }

  reset<K extends keyof M>() {
    const collectionStore = new Map<K, Collection<M[K]>>();
    databaseCollectionStores.set(this, collectionStore);
  }

  update<K extends keyof M>(
    collectionName: K,
    id: RecordId,
    data: Partial<M[K]>
  ): DataRecord<M[K]> {
    const collection = this.getCollection(collectionName);
    const { records } = collection;
    const oldRecord = this.delete(collectionName, id);

    if (oldRecord) {
      const record = {
        ...oldRecord,
        data: {
          ...oldRecord.data,
          ...data
        }
      };
      records.push(record);
      return record;
    } else {
      throw new RecordNotFoundError(collectionName as string, id);
    }
  }

  getCollectionStore<K extends keyof M>(): Map<K, Collection<M[K]>> {
    const collectionStore = databaseCollectionStores.get(this);
    if (collectionStore) {
      return collectionStore;
    } else {
      throw new Error('This database needs to be initialized.');
    }
  }

  getCollection<K extends keyof M>(
    collectionName: K
  ): Collection<M[K]> {
    const collectionStore = this.getCollectionStore();
    const collection = collectionStore.get(collectionName);
    if (collection) {
      return collection;
    } else {
      throw new CollectionNotFoundError(collectionName as string);
    }
  }
}

export class CollectionNotFoundError extends Error {
  constructor(collectionName: string) {
    super(`Collection ${collectionName} not found`);
  }
}

export class RecordNotFoundError extends Error {
  constructor(collectionName: string, id: RecordId) {
    super(`Record ${id} not found in collection ${collectionName}`);
  }
}
