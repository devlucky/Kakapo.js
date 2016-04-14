import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';

export class Database {
  constructor() {
    this.setInitialState();
  }

  all(collectionName) {
    return this.filter(collectionName, {});
  }

  checkFactoryPresence(name) {
    if (!this.factoryFor(name)) {
      throw Error(`Factory ${name} not found`);
    }
  }

  create(collectionName, size) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factories[collectionName];
    const records = this.store[collectionName] || [];

    while (size--) {
      const record = _.mapValues(factory(faker), field =>
        _.isFunction(field) ? field() : field);
      records.push(this.decorateRecord(collectionName, record));
    }

    this._pushToStore(collectionName, records);
  }

  decorateRecord(collectionName, record) {
    return Object.assign({}, record, {id: this.uuid(collectionName)});
  }

  factoryFor(collectionName) {
    return this.factories[collectionName];
  }

  filter(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.filter(this.store[collectionName], conditions);
  }

  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.find(this.store[collectionName], conditions);
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const records = this.store[collectionName] || [];
    const content = _.castArray(record);

    records.push(...content);

    this._pushToStore(collectionName, records);
  }

  register(collectionName, factory) {
    this.factories[collectionName] = factory;
    this.store[collectionName] = [];
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
    const id = this._uuids[collectionName] || 0;

    this._uuids[collectionName] = id + 1;

    return id;
  }

  _pushToStore(collectionName, records) {
    this.store[collectionName] = records.map(record =>
      recordFactory(record, collectionName, this));
  }
}
