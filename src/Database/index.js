import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';
import {
  deepMapValues,
  lastItem,
  randomIndex,
  randomItem,
} from '../helpers/util';

const pushToStore = (collectionName, records, store) => {
  Object.assign(
    store[collectionName],
    records.map(r => recordFactory(r, collectionName, store))
  );
};

const storeRecords = new WeakMap();

export class Database {
  constructor() {
    this.reset();
  }

  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(storeRecords.get(this).get(collectionName));
    if (raw) { return records; }

    return this.serialize(records, collectionName);
  }

  belongsTo(collectionName, predicate) {
    return () => {
      if (predicate) { return this.find(collectionName, predicate); }
      return this.randomRecords(collectionName, 1);
    };
  }

  hasMany(collectionName, limit) {
    const randomLimit = randomIndex(this.all(collectionName)) + 1;
    return () => this.randomRecords(collectionName, limit || randomLimit);
  }

  checkFactoryPresence(name) {
    if (!this.factoryFor(name)) {
      throw Error(`Factory ${name} not found`);
    }
  }

  create(collectionName, size) {
    this.checkFactoryPresence(collectionName);

    const currentStoreRecords = storeRecords.get(this);
    const factory = this.factoryFor(collectionName);
    const records = currentStoreRecords.get(collectionName);

    for (let idx = 0; idx < size; ++idx) {
      const record = deepMapValues(factory(faker), (field) => {
        if (_.isFunction(field)) { return field(); }
        return field;
      });

      records.push(this.decorateRecord(collectionName, record));
    }

    currentStoreRecords.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentStoreRecords)));
  }

  decorateRecord(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    return _.assign({}, record, { id: this.uuid(collectionName) });
  }

  factoryFor(collectionName) {
    const factory = this.factories[collectionName];

    return factory ? factory.factory : undefined;
  }

  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);

    return this.serialize(
      _.filter(this.all(collectionName, true), conditions),
      collectionName
    );
  }

  findOne(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return this.serialize(
      _.find(this.all(collectionName, true), conditions),
      collectionName
    )[0];
  }

  first(collectionName) {
    this.checkFactoryPresence(collectionName);
    return this.all(collectionName)[0];
  }

  last(collectionName) {
    this.checkFactoryPresence(collectionName);
    return lastItem(this.all(collectionName));
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);

    const currentStoreRecords = storeRecords.get(this);
    const records = currentStoreRecords.get(collectionName);
    const content = _.castArray(record);

    records.push(...content);

    currentStoreRecords.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentStoreRecords)));
  }

  register(collectionName, factory, serializer) {
    this.factories[collectionName] = { factory, serializer };
    this.store[collectionName] = [];

    storeRecords.get(this).set(collectionName, []);
  }

  serialize(record, collectionName) {
    const serializer = this.serializerFor(collectionName);
    const records = _.castArray(record);
    if (!serializer) { return records; }

    return records.map(r => serializer(r, collectionName));
  }

  serializerFor(collectionName) {
    const factory = this.factories[collectionName];

    return factory ? factory.serializer : undefined;
  }

  randomRecords(collectionName, limit = 1) {
    const all = this.all(collectionName);
    const records = [];

    for (let idx = 0; idx < limit; ++idx) {
      records.push(randomItem(all));
    }

    return records;
  }

  reset() {
    this.factories = {};
    this.store = {};
    this.uuids = {};
    storeRecords.set(this, new Map());
  }

  uuid(collectionName) {
    this.checkFactoryPresence(collectionName);

    const id = this.uuids[collectionName] || 0;
    this.uuids[collectionName] = id + 1;

    return id;
  }
}
