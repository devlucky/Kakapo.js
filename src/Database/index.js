import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';
import {
  deepMapValues,
  lastItem,
  randomIndex,
  randomItem,
} from '../helpers/util';

const factoryStore = new WeakMap();
const recordStore = new WeakMap();
const serializerStore = new WeakMap();

export class Database {
  constructor() {
    this.reset();
  }

  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(recordStore.get(this).get(collectionName));

    if (raw) { return records; }
    return this.serialize(records, collectionName);
  }

  belongsTo(collectionName, predicate) {
    return () => {
      if (predicate) { return this.find(collectionName, predicate); }
      return this.randomRecords(collectionName, 1)[0];
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

    const currentRecordStore = recordStore.get(this);
    const factory = this.factoryFor(collectionName);
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

  factoryFor(collectionName) {
    return factoryStore.get(this).get(collectionName);
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

    const currentRecordStore = recordStore.get(this);
    const records = currentRecordStore.get(collectionName);
    const content = _.castArray(record);

    records.push(...content);

    currentRecordStore.set(collectionName, records.map(r =>
      recordFactory(r, collectionName, currentRecordStore)));
  }

  register(collectionName, factory, serializer) {
    factoryStore.get(this).set(collectionName, factory);
    recordStore.get(this).set(collectionName, []);
    serializerStore.get(this).set(collectionName, serializer);
  }

  serialize(record, collectionName) {
    const serializer = this.serializerFor(collectionName);
    const records = _.castArray(record);

    if (!serializer) { return records; }
    return records.map(r => serializer(r, collectionName));
  }

  serializerFor(collectionName) {
    return serializerStore.get(this).get(collectionName);
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
    this.uuids = {};

    factoryStore.set(this, new Map());
    recordStore.set(this, new Map());
    serializerStore.set(this, new Map());
  }

  uuid(collectionName) {
    this.checkFactoryPresence(collectionName);

    const id = this.uuids[collectionName] || 0;
    this.uuids[collectionName] = id + 1;

    return id;
  }
}
