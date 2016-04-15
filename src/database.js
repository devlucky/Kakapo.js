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
    return this.store[collectionName];
  }

  checkFactoryPresence(name) {
    if (!this.factoryFor(name)) {
      throw Error(`Factory ${name} not found`);
    }
  }

  create(collectionName, size) {
    this.checkFactoryPresence(collectionName);

    const factory = this.factoryFor(collectionName);
    const serializer = this.serializerFor(collectionName);
    const records = this.store[collectionName] || [];

    while (size--) {
      const record = _.mapValues(factory(faker), field =>
        _.isFunction(field) ? field() : field);
      //TODO: Apply Serializer if is present after the decoration
      records.push(
        serializer(
          this.decorateRecord(collectionName, record)
        )
      );
    }

    pushToStore(collectionName, records, this);
  }

  decorateRecord(collectionName, record) {
    return Object.assign({}, record, {id: this.uuid(collectionName)});
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

  register(collectionName, factory, serializer) {
    this.factories[collectionName] = {factory, serializer};
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
}
