import faker from 'faker';
import _ from 'lodash';
import { recordFactory } from './recordFactory';

const pushToStore = (collectionName, records, database) => {
  database.store[collectionName] = records.map(record =>
    recordFactory(record, collectionName, database));
};

export class Database {
  constructor() {
    this.setInitialState();
  }

  all(collectionName) {
    this.checkFactoryPresence(collectionName);
    return this.store[collectionName];
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

    pushToStore(collectionName, records, this);
  }

  decorateRecord(collectionName, record) {
    this.checkFactoryPresence(collectionName);
    return Object.assign({}, record, {id: this.uuid(collectionName)});
  }

  factoryFor(collectionName) {
    return this.factories[collectionName];
  }

  filter(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.filter(this.all(collectionName), conditions);
  }

  find(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.find(this.all(collectionName), conditions);
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const records = this.store[collectionName] || [];
    const content = _.castArray(record);

    records.push(...content);

    pushToStore(collectionName, records, this);
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
    this.checkFactoryPresence(collectionName);

    const id = this._uuids[collectionName] || 0;
    this._uuids[collectionName] = id + 1;

    return id;
  }
}
