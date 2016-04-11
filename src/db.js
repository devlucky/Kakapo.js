import faker from 'faker';
import _ from 'lodash';

export class DB {
  constructor() {
    this.setInitialState();
  }

  register(collectionName, factory) {
    this.factories[collectionName] = factory;
    this.store[collectionName] = [];
  }

  //TODO: This method must return the generated data
  create(collectionName, size) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factories[collectionName];
    const records = this.store[collectionName] || [];

    while (size--) {
      const record = factory(faker);
      Object.keys(record).forEach(field => record[field] = record[field]());
      records.push(this.decorateFactory(collectionName, record));
    }

    this.store[collectionName] = records;
  }

  find(collectionName, conditions) {
    const factory = this.factoryFor(collectionName);

    if (!factory) {
      return;
    }

    return _.find(this.store[collectionName], conditions);
  }

  push(collectionName, record) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const records = this.store[collectionName] || [];
    const content = _.castArray(record);

    records.push(...content);

    this.store[collectionName] = records;
  }

  filter(collectionName, conditions) {
    this.checkFactoryPresence(collectionName);
    return _.filter(this.store[collectionName], conditions);
  }

  checkFactoryPresence(name) {
    if (!this.factoryFor(name)) {
      throw Error(`Factory ${name} not found`);
    }
  }

  all(collectionName) {
    return this.store[collectionName];
  }

  factoryFor(collectionName) {
    return this.factories[collectionName];
  }

  decorateFactory(collectionName, record) {
    return Object.assign({}, record, {id: this.uuid(collectionName)});
  }

  uuid(collectionName) {
    const id = this._uuids[collectionName] || 0;

    this._uuids[collectionName] = id + 1;

    return id;
  }

  reset() {
    this.setInitialState();
  }

  setInitialState() {
    this.factories = {};
    this.store = {};
    this._uuids = {};
  }
}
