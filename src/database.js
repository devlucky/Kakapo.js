import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';

const pushToStore = (collectionName, records, store) => {
  store[collectionName] = records.map(record =>
    recordFactory(record, collectionName, store));
};

export class Database {
  constructor() {
    this.setInitialState();
  }

  all(collectionName, raw = false) {
    this.checkFactoryPresence(collectionName);
    const records = _.cloneDeep(this.store[collectionName]);
    if (raw) return records;

    return this.serialize(records, collectionName)
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
      const record = _.mapValues(factory(faker), field =>
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

    return factory ? factory.factory : null;
  }

  serializerFor(collectionName) {
    const factory = this.factories[collectionName];

    return factory ? factory.serializer : () => {}; 
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
    const records = Array.isArray(record) ? record : [record];
    if (!serializer) return records;

    return records.map(r => serializer(r, collectionName));
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

