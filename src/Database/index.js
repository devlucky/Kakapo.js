// @flow
import { type Predicate } from "lodash";
import cloneDeep from "lodash/clonedeep";
import sample from "lodash/sample";
import isFunction from "lodash/isfunction";
import assign from "lodash/assign";
import filter from "lodash/filter";
import first from "lodash/first";
import random from "lodash/random";
import sampleSize from "lodash/samplesize";
import last from "lodash/last";

const databaseCollectionStores: WeakMap<
  Database<any>,
  CollectionStore<any, any, any>
> = new WeakMap();

export type DatabaseSchema = { [collectionName: string]: CollectionSchema };
export type CollectionSchema = any;

export type CollectionStore<
  M: DatabaseSchema,
  C = $Keys<M>,
  T = $ElementType<M, C>
> = Map<C, Collection<T>>;

export type Collection<T> = {
  uuid: number,
  factory: DataFactory<T>,
  records: Record<T>[],
  serializer: DataSerializer<T>
};

export type DataSerializer<T> = (data: T) => T;
export type DataFactory<T> = () => T;

export type Record<T> = {
  +id: number,
  save(): void,
  delete(): void,
  +data: T
};

export class Database<M: DatabaseSchema> {
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
  all<C: $Keys<M>>(
    collectionName: C,
    raw: boolean = false
  ): Record<$ElementType<M, C>>[] {
    // this.checkFactoryPresence(collectionName);
    // const records = cloneDeep(recordStore.get(this).get(collectionName));
    // return raw ? records : records.map(r => this.serialize(r, collectionName));

    const { records } = this.getCollection(collectionName);

    return records;
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
  belongsTo<C: $Keys<M>>(
    collectionName: C,
    conditions: ?Predicate<$ElementType<M, C>>
  ): () => Record<$ElementType<M, C>> {
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
  create<C: $Keys<M>>(
    collectionName: C,
    size: number = 1
  ): Record<$ElementType<M, C>>[] {
    const { factory, serializer } = this.getCollection(collectionName);
    const records = [];

    for (let index = 0; index < size; index++) {
      const data = factory();
      records.push(this.push(collectionName, data));
    }

    return records.map(this.serialize(serializer));
  }

  serialize<C: $Keys<M>>(serializer: DataSerializer<$ElementType<M, C>>) {
    return (record: Record<$ElementType<M, C>>): Record<$ElementType<M, C>> => {
      const { data, ...others } = record;
      return {
        ...others,
        data: serializer(data)
      };
    };
  }

  createRecord<C: $Keys<M>>(
    collectionName: C,
    data: $ElementType<M, C>
  ): Record<$ElementType<M, C>> {
    const collection = this.getCollection(collectionName);
    const { uuid, records } = collection;

    collection.uuid++;

    return {
      id: uuid,
      save: () => {},
      delete: () => {
        const index = records.findIndex(record => record.id === uuid);
        records.splice(index, 1);
      },
      data
    };
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
  find<C: $Keys<M>>(
    collectionName: $Keys<M>,
    conditions: ?Predicate<$ElementType<M, C>>
  ): Record<$ElementType<M, C>>[] {
    const { records } = this.getCollection(collectionName);
    return filter(records, conditions);
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
  findOne<C: $Keys<M>>(
    collectionName: $Keys<M>,
    conditions: ?Predicate<$ElementType<M, C>>
  ) {
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
  first(collectionName: $Keys<M>) {
    return first(this.all(collectionName));
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
    const randomLimit = random(1, this.all(collectionName).length);
    return () => sampleSize(this.all(collectionName), limit || randomLimit);
  }

  /**
   * Returns last record from specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Object}
   * @public
   */
  last(collectionName: $Keys<M>) {
    return last(this.all(collectionName));
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
  push<C: $Keys<M>>(
    collectionName: C,
    data: $ElementType<M, C>
  ): Record<$ElementType<M, C>> {
    const collection = this.getCollection(collectionName);
    const record = this.createRecord(collectionName, data);

    collection.records.push(record);

    return record;
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
  register<C: $Keys<M>>(
    collectionName: C,
    factory: DataFactory<$ElementType<M, C>>,
    serializer: DataSerializer<$ElementType<M, C>> = data => data
  ) {
    this.getCollectionStore().set(collectionName, {
      uuid: 0,
      records: [],
      factory,
      serializer
    });
  }

  /**
   * Restores all Database's stores to their initial state.
   *
   * @public
   */
  reset() {
    databaseCollectionStores.set(this, new Map());
  }

  getCollectionStore<C: $Keys<M>>(): CollectionStore<M, C, $ElementType<M, C>> {
    const collectionStore = databaseCollectionStores.get(this);
    if (collectionStore) {
      return collectionStore;
    } else {
      throw new Error("This database needs to be initialized.");
    }
  }

  getCollection<C: $Keys<M>>(
    collectionName: C
  ): Collection<$ElementType<M, C>> {
    const collectionStore = this.getCollectionStore();
    const collection = collectionStore.get(collectionName);
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
