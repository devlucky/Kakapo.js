// @flow
import { type Predicate } from "lodash";
import sample from "lodash/sample";
import filter from "lodash/filter";
import first from "lodash/first";
import last from "lodash/last";

const databaseCollectionStores: WeakMap<
  Database<any>,
  CollectionStore<Object>
> = new WeakMap();

export type DatabaseSchema = {
  +[collectionName: string]: Object
};

export type CollectionStore<M: DatabaseSchema, K: $Keys<M> = $Keys<M>> = {
  [collectionName: K]: $ElementType<M, K> | typeof undefined
};

export type Collection<T> = {
  +uuid: number,
  +factory: DataFactory<T>,
  +records: Record<T>[]
};

export type DataFactory<T> = () => T;

export opaque type RecordId = number;

export type Record<T> = {
  +id: RecordId,
  +data: T
};

export class Database<M: DatabaseSchema = Object> {
  constructor() {
    this.reset();
  }

  all<K: $Keys<M>>(collectionName: K): Record<$ElementType<M, K>>[] {
    const { records } = this.getCollection(collectionName);
    return records;
  }

  belongsTo<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<$ElementType<M, K>>
  ): () => Record<$ElementType<M, K>> {
    return () => {
      if (conditions) {
        return this.findOne(collectionName, conditions);
      } else {
        return sample(this.all(collectionName));
      }
    };
  }

  create<K: $Keys<M>>(
    collectionName: K,
    size: number = 1,
    factory?: DataFactory<$ElementType<M, K>>
  ): Record<$ElementType<M, K>>[] {
    const dataFactory = factory || this.getCollection(collectionName).factory;
    const records = [];

    for (let index = 0; index < size; index++) {
      const data = dataFactory();
      const record = this.push(collectionName, data);
      records.push(record);
    }

    return records;
  }

  delete<K: $Keys<M>>(
    collectionName: K,
    id: RecordId
  ): Record<$ElementType<M, K>> | null {
    const collection = this.getCollection(collectionName);
    const { records } = collection;
    const record = records.find(record => record.id === id);

    if (record) {
      const index = records.indexOf(record);
      records.splice(index, 1);
      return record;
    } else {
      return null;
    }
  }

  exists<K: $Keys<M>>(collectionName: K): boolean {
    const collectionStore = this.getCollectionStore();
    return !!collectionStore[collectionName];
  }

  find<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<$ElementType<M, K>>
  ): Record<$ElementType<M, K>>[] {
    const { records } = this.getCollection(collectionName);
    return filter(records, { data: conditions });
  }

  findOne<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<$ElementType<M, K>>
  ): Record<$ElementType<M, K>> {
    return first(this.find(collectionName, conditions));
  }

  first<K: $Keys<M>>(collectionName: K): Record<$ElementType<M, K>> {
    const { records } = this.getCollection(collectionName);
    return first(records);
  }

  last<K: $Keys<M>>(collectionName: K): Record<$ElementType<M, K>> {
    const { records } = this.getCollection(collectionName);
    return last(records);
  }

  push<K: $Keys<M>>(
    collectionName: K,
    data: $ElementType<M, K>
  ): Record<$ElementType<M, K>> {
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

  register<K: $Keys<M>>(
    collectionName: K,
    factory: DataFactory<$ElementType<M, K>>
  ) {
    this.getCollectionStore()[collectionName] = {
      uuid: 0,
      records: [],
      factory
    };
  }

  reset() {
    databaseCollectionStores.set(this, new Map());
  }

  update<K: $Keys<M>>(
    collectionName: K,
    id: RecordId,
    data: $Shape<$ElementType<M, K>>
  ): Record<$ElementType<M, K>> {
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
      throw new RecordNotFoundError(collectionName, id);
    }
  }

  getCollectionStore(): CollectionStore<M> {
    const collectionStore = databaseCollectionStores.get(this);
    if (collectionStore) {
      return collectionStore;
    } else {
      throw new Error("This database needs to be initialized.");
    }
  }

  getCollection<K: $Keys<M>>(
    collectionName: K
  ): Collection<$ElementType<M, K>> {
    const collectionStore = this.getCollectionStore();
    const collection = collectionStore[collectionName];
    if (collection) {
      return collection;
    } else {
      throw new CollectionNotFoundError(collectionName);
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
