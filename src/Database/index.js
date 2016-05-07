import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';
import { lastItem, randomIndex, randomItem } from '../helpers/util';

const pushToStore = (collectionName, records, store) => {
  store[collectionName] = records.map(record =>
    recordFactory(record, collectionName, store));
};

const deepMap = (obj, fn) => {
  return _.mapValues(obj, (value, key) => {
    if (_.isPlainObject(value)) return deepMap(value, fn);
    return fn(value);
  });
}

export class Database {
  constructor() {
    this.setInitialState();
  }

  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(this.store[collectionName]);
    if (raw) {return records;}

    return this.serialize(records, collectionName)
  }

  belongsTo(collectionName, predicate) {
    return () => predicate ?
      this.find(collectionName, predicate) :
      this.randomRecord(collectionName);
  }

  hasMany(collectionName, limit = randomIndex(this.all(collectionName)) + 1) {
    return () => this.randomRecords(collectionName, limit);
  }

  checkFactoryPresence(name) {
    if (!this.factoryFor(name)) {
      throw Error(`Factory ${name} not found`);
    }
  }

  create(collectionName, size) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const records = this.store[collectionName] || [];

    while (size--) {
      const record = deepMap(factory(faker), field =>
        _.isFunction(field) ? field() : field);

      records.push(this.decorateRecord(collectionName, record));
    }

    pushToStore(collectionName, records, this.store);
  }

  decorateRecord(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    return _.assign({}, record, {id: this.uuid(collectionName)});
  }

  factoryFor(collectionName) {
    const factory = this.factories[collectionName];

    return factory ? factory.factory : undefined;
  }

  filter(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return this.serialize(
      _.filter(this.all(collectionName, true), conditions),
      collectionName
    );
  }

  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return this.serialize(
      _.find(this.all(collectionName, true), conditions),
      collectionName
    )[0];
  }

  first(collectionName) {
    return this.all(collectionName)[0];
  }

  last(collectionName) {
    return lastItem(this.all(collectionName));
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const records = this.store[collectionName] || [];
    const content = _.castArray(record);

    records.push(...content);

    pushToStore(collectionName, records, this.store);
  }

  register(collectionName, factory, serializer) {
    this.factories[collectionName] = {factory, serializer};
    this.store[collectionName] = [];
  }

  serialize(record, collectionName) {
    const serializer = this.serializerFor(collectionName);
    const records = _.castArray(record);
    if (!serializer) {return records;}

    return records.map(r => serializer(r, collectionName));
  }

  serializerFor(collectionName) {
    const factory = this.factories[collectionName];

    return factory ? factory.serializer : undefined;
  }

  randomRecord(collectionName) {
    return this.randomRecords(collectionName)[0];
  }

  randomRecords(collectionName, limit = 1) {
    const all = this.all(collectionName);
    const records = [];

    while (limit) {
      records.push(randomItem(all));
      limit--;
    }

    return records;
  }

  reset() {
    this.setInitialState();
  }

  setInitialState() {
    this.factories = {};
    this.store = {};
    this._uuids = {};
  }

  uuid(collectionName) {
    this.checkFactoryPresence(collectionName);

    const id = this._uuids[collectionName] || 0;
    this._uuids[collectionName] = id + 1;

    return id;
  }
}
