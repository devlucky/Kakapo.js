import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';
import { deepMapValues } from '../helpers/util';

const factoryStore = new WeakMap();
const recordStore = new WeakMap();
const serializerStore = new WeakMap();
const uuidStore = new WeakMap();

export class Database {
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
  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(recordStore.get(this).get(collectionName));
    return raw ? records : records.map(r => this.serialize(r, collectionName));
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
  belongsTo(collectionName, conditions) {
    return () => {
      if (conditions) { return this.find(collectionName, conditions); }
      return _.sample(this.all(collectionName));
    };
  }

  /**
   * Throws error if collection with specified name doesn't exist.
   *
   * @param {string} collectionName - name of collection
   *
   * @throws {ReferenceError}.
   * @private
   */
  checkFactoryPresence(collectionName) {
    if (!this.getFactory(collectionName)) {
      throw new ReferenceError(`Factory ${collectionName} not found`);
    }
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
  create(collectionName, size = 1) {
    this.checkFactoryPresence(collectionName);

    const currentRecordStore = recordStore.get(this);
    const factory = this.getFactory(collectionName);
    const records = currentRecordStore.get(collectionName);

    for (let idx = 0; idx < size; ++idx) {
      const record = deepMapValues(factory(faker), (field) => {
        if (_.isFunction(field)) { return field(); }
        return field;
      });

      records.push(this.decorateRecord(collectionName, record));
    }

    currentRecordStore.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentRecordStore)));
  }

  /**
   * Returns record with generated uuid field added on it.
   *
   * @param {string} collectionName - name of collection
   * @param {Object} record - record to decorate
   *
   * @returns {Object}
   * @private
   */
  decorateRecord(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    return _.assign({}, record, { id: this.uuid(collectionName) });
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
  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.filter(this.all(collectionName, true), conditions)
      .map(r => this.serialize(r, collectionName));
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
  findOne(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.first(this.find(collectionName, conditions));
  }

  /**
   * Returns first record from specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Object}
   * @public
   */
  first(collectionName) {
    this.checkFactoryPresence(collectionName);
    return _.first(this.all(collectionName));
  }

  /**
   * Returns factory for specified collection from Database's store.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Map}
   * @private
   */
  getFactory(collectionName) {
    return factoryStore.get(this).get(collectionName);
  }

  /**
   * Returns serializer for specified collection from Database's store.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Map}
   * @private
   */
  getSerializer(collectionName) {
    return serializerStore.get(this).get(collectionName);
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
  hasMany(collectionName, limit) {
    const randomLimit = _.random(1, this.all(collectionName).length);
    return () => _.sampleSize(this.all(collectionName), limit || randomLimit);
  }

  /**
   * Returns last record from specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {Object}
   * @public
   */
  last(collectionName) {
    this.checkFactoryPresence(collectionName);
    return _.last(this.all(collectionName));
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
  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    const currentRecordStore = recordStore.get(this);
    const records = currentRecordStore.get(collectionName);

    records.push(record);

    currentRecordStore.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentRecordStore)));
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
  register(collectionName, factory, serializer) {
    factoryStore.get(this).set(collectionName, factory);
    recordStore.get(this).set(collectionName, []);
    serializerStore.get(this).set(collectionName, serializer);
    uuidStore.get(this).set(collectionName, 0);
  }

  /**
   * Restores all Database's stores to their initial state.
   *
   * @public
   */
  reset() {
    factoryStore.set(this, new Map());
    recordStore.set(this, new Map());
    serializerStore.set(this, new Map());
    uuidStore.set(this, new Map());
  }

  /**
   * Returns record serialized with serializer specified in register method.
   *
   * @param {string} collectionName - name of collection
   * @param {Object} record - record to decorate
   *
   * @returns {Object}
   * @private
   */
  serialize(record, collectionName) {
    const serializer = this.getSerializer(collectionName);
    return serializer ? serializer(record) : record;
  }

  /**
   * Returns next generated uuid for specified collection.
   *
   * @param {string} collectionName - name of collection
   *
   * @returns {number}
   * @private
   */
  uuid(collectionName) {
    this.checkFactoryPresence(collectionName);
    const id = uuidStore.get(this).get(collectionName);

    uuidStore.get(this).set(collectionName, id + 1);
    return id;
  }
}
