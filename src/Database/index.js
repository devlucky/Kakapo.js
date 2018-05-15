// @flow
import { type Predicate } from "lodash";
import cloneDeep from "lodash/clonedeep";
import sample from "lodash/sample";
import isFunction from "lodash/isfunction";
import assign from "lodash/assign";
import filter from "lodash/filter";
import first from "lodash/first";
import random from "lodash/random";
import sampleSize from "lodash/sampleSize";
import last from "lodash/last";
import some from "lodash/some";

const databaseCollectionStores: WeakMap<
  Database<any>,
  CollectionStore<Object>
> = new WeakMap();

export type DatabaseSchema = {
  +[collectionName: string]: CollectionSchema<Object, Object>
};

export type CollectionSchema<T: Object, S: Object = T> = {
  +raw: T,
  +serialized: S
};

export type RawData<M: DatabaseSchema, K: $Keys<M>> = $PropertyType<
  $ElementType<M, K>,
  "raw"
>;

export type SerializedData<M: DatabaseSchema, K: $Keys<M>> = $PropertyType<
  $ElementType<M, K>,
  "serialized"
>;

export type CollectionStore<M: DatabaseSchema, K: $Keys<M> = $Keys<M>> = {
  [collectionName: K]: Collection<RawData<M, K>, SerializedData<M, K>>
};

export type Collection<T, S> = {
  +uuid: number,
  +factory: DataFactory<T>,
  +records: Record<T>[],
  +serializer: DataSerializer<T, S>
};

export type DataFactory<T> = () => T;

export type DataSerializer<T: Object, S: Object> = (data: T) => S;

export type Record<T> = {
  +id: number,
  +data: T,
  save(): void,
  delete(): void
};

type AllFunction<M: DatabaseSchema> = (<K: $Keys<M>>(
  K,
  false
) => Record<SerializedData<M, K>>[]) &
  (<M: DatabaseSchema, K: $Keys<M>>(K, true) => Record<RawData<M, K>>[]);

export class Database<M: DatabaseSchema = Object> {
  /**
   * Creates new Database and initializes it's state.
   *
   * @public
   */
  constructor() {
    this.reset();
  }

  /**
   * Returns all records from specified collection, either as an array
   * or as a serialized object.
   *
   * @param {string} collectionName - name of collection
   * @param {boolean} [raw=false] - flag to specify if records should be serialized
   *
   * @returns {Array<Object>|Object}
   * @public
   */
  all<K: $Keys<M>>(
    collectionName: K,
    raw: boolean = false
  ): Record<SerializedData<M, K>>[] | Record<RawData<M, K>> {
    const { records, serializer } = this.getCollection(collectionName);
    if (raw) {
      return records;
    } else {
      return records.map(this.serialize(serializer));
    }
  }

  /**
   * Returns thunk returning record from specified collection, based on conditions or
   * random record if no conditions were specified.
   *
   * @param {string} collectionName - name of collection
   * @param {Array|Function|Object|string} [conditions] - search conditions for the record
   *
   * @returns {Function}
   * @private
   */
  belongsTo<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<RawData<M, K>>
  ): () => Record<SerializedData<M, K>> {
    return () => {
      if (conditions) {
        return this.findOne(collectionName, conditions);
      } else {
        return sample(this.all(collectionName));
      }
    };
  }

  /**
   * Creates collection of records in Database instance of specified size, based
   * on record's factory registered before.
   *
   * @param {string} collectionName - name of collection
   * @param {number} [size=1] - size of collection to create
   *
   * @public
   */
  create<K: $Keys<M>>(
    collectionName: K,
    size: number = 1,
    factory?: DataFactory<RawData<M, K>>
  ): Record<SerializedData<M, K>>[] {
    const dataFactory = factory || this.getCollection(collectionName).factory;
    const records = [];

    for (let index = 0; index < size; index++) {
      const data: RawData<M, K> = dataFactory();
      const record = this.push(collectionName, data);
      records.push(record);
    }

    return records;
  }

  /**
   * Returns records from specified collection, matching specified requirements.
   *
   * @param {string} collectionName - name of collection
   * @param {Array|Function|Object|string} [conditions] - search conditions for the record
   *
   * @returns {Array<Object>}
   * @public
   */
  find<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<RawData<M, K>>
  ): Record<SerializedData<M, K>>[] {
    const { records, serializer } = this.getCollection(collectionName);
    return filter(records, { data: conditions }).map(
      this.serialize(serializer)
    );
  }

  /**
   * Returns one record from specified collection, matching specified requirements.
   *
   * @param {string} collectionName - name of collection
   * @param {Array|Function|Object|string} [conditions] - search conditions for the record
   *
   * @returns {Object}
   * @public
   */
  findOne<K: $Keys<M>>(
    collectionName: K,
    conditions: ?Predicate<RawData<M, K>>
  ): Record<SerializedData<M, K>> {
    return first(this.find(collectionName, conditions));
  }

  /**
   * Returns first record from specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Object}
   * @public
   */
  first<K: $Keys<M>>(collectionName: K): Record<SerializedData<M, K>> {
    const { records, serializer } = this.getCollection(collectionName);
    return this.serialize(serializer)(first(records));
  }

  /**
   * Returns thunk returning collection of records from specified collection of
   * specified limit.
   *
   * @param {string} collectionName - name of collection
   * @param {number} [limit = 1] - limit of records in collection to return
   *
   * @returns {Function}
   * @private
   */
  hasMany(collectionName: $Keys<M>, limit: number) {
    const { records, serializer } = this.getCollection(collectionName);
    const randomLimit = random(1, records.length);
    return () => sampleSize(records, limit || randomLimit);
  }

  /**
   * Returns last record from specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Object}
   * @public
   */
  last<K: $Keys<M>>(collectionName: K): Record<SerializedData<M, K>> {
    const { records, serializer } = this.getCollection(collectionName);
    return this.serialize(serializer)(last(records));
  }

  /**
   * Pushes record manually to the end of specified collection.
   *
   * @param {string} collectionName - name of collection
   * @param {Object} record - record to push
   *
   * @returns {Object}
   * @public
   */
  push<K: $Keys<M>>(
    collectionName: K,
    data: RawData<M, K>
  ): Record<SerializedData<M, K>> {
    const collection = this.getCollection(collectionName);
    const { uuid, records, serializer } = collection;

    collection.uuid++;

    const record = {
      id: uuid,
      save: () => {},
      delete: () => {
        const index = records.findIndex(record => record.id === uuid);
        records.splice(index, 1);
      },
      data
    };

    records.push(record);

    return this.serialize(serializer)(record);
  }

  serialize<K: $Keys<M>>(
    serializer: DataSerializer<RawData<M, K>, SerializedData<M, K>>
  ): DataSerializer<Record<RawData<M, K>>, Record<SerializedData<M, K>>> {
    return record => {
      const { data, ...others } = record;
      return {
        ...others,
        data: serializer(data)
      };
    };
  }

  /**
   * Registers factory for use in creation of records in specified collection.
   * Registers serializer for use in returning of records in specified collection.
   *
   * @param {string} collectionName name of collection
   * @param {Object} [factory] - factory to create records with
   * @param {Object} [serializer] - serializer to serialize records with
   *
   * @public
   */
  register<K: $Keys<M>>(
    collectionName: K,
    factory: DataFactory<RawData<M, K>>,
    serializer?: DataSerializer<RawData<M, K>, SerializedData<M, K>> = data =>
      data
  ) {
    this.getCollectionStore()[collectionName] = {
      uuid: 0,
      records: [],
      factory,
      serializer
    };
  }

  /**
   * Restores all Database's stores to their initial state.
   *
   * @public
   */
  reset() {
    databaseCollectionStores.set(this, new Map());
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
  ): Collection<RawData<M, K>, SerializedData<M, K>> {
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
