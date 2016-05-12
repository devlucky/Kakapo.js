import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';
import { deepMapValues } from '../helpers/util';

const factoryStore = new WeakMap();
const recordStore = new WeakMap();
const serializerStore = new WeakMap();
const uuidStore = new WeakMap();

export class Database {
  constructor() {
    this.reset();
  }

  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(recordStore.get(this).get(collectionName));
    return raw ? records : records.map(r => this.serialize(r, collectionName));
  }

  belongsTo(collectionName, predicate) {
    return () => {
      if (predicate) { return this.find(collectionName, predicate); }
      return _.sample(this.all(collectionName));
    };
  }

  checkFactoryPresence(name) {
    if (!this.getFactory(name)) { throw Error(`Factory ${name} not found`); }
  }

  create(collectionName, size) {
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

  decorateRecord(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    return _.assign({}, record, { id: this.uuid(collectionName) });
  }

  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.filter(this.all(collectionName, true), conditions)
      .map(r => this.serialize(r, collectionName));
  }

  findOne(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.first(this.find(collectionName, conditions));
  }

  first(collectionName) {
    this.checkFactoryPresence(collectionName);
    return _.first(this.all(collectionName));
  }

  getFactory(collectionName) {
    return factoryStore.get(this).get(collectionName);
  }

  getSerializer(collectionName) {
    return serializerStore.get(this).get(collectionName);
  }

  hasMany(collectionName, limit) {
    const randomLimit = _.random(1, this.all(collectionName).length);
    return () => _.sampleSize(this.all(collectionName), limit || randomLimit);
  }

  last(collectionName) {
    this.checkFactoryPresence(collectionName);
    return _.last(this.all(collectionName));
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    const currentRecordStore = recordStore.get(this);
    const records = currentRecordStore.get(collectionName);

    records.push(record);

    currentRecordStore.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentRecordStore)));
  }

  register(collectionName, factory, serializer) {
    factoryStore.get(this).set(collectionName, factory);
    recordStore.get(this).set(collectionName, []);
    serializerStore.get(this).set(collectionName, serializer);
  }

  reset() {
    factoryStore.set(this, new Map());
    recordStore.set(this, new Map());
    serializerStore.set(this, new Map());
    uuidStore.set(this, new Map());
  }

  serialize(record, collectionName) {
    const serializer = this.getSerializer(collectionName);
    return serializer ? serializer(record) : record;
  }

  uuid(collectionName) {
    this.checkFactoryPresence(collectionName);
    const id = uuidStore.get(this).get(collectionName) || 0;

    uuidStore.get(this).set(collectionName, id + 1);
    return id;
  }
}
