import faker from 'faker';

export class DB {
  constructor() {
    this.setInitialState();
  }

  register(name, factory) {
    this.factories[name] = factory;
    this.store[name] = [];
  }

  create(factoryName, number) {
    this.checkFactoryPresence(factoryName);

    const factory = this.factories[factoryName];
    let records = this.store[factoryName] || [];

    while (number) {
      records.push(this.decorateFactory(factoryName, factory(faker)));
      number--;
    }

    this.store[factoryName] = records;
  }

  find(factoryName, id) {
    const factory = this.factoryFor(factoryName);
    if (!factory) return;

    return this.store[factoryName].find(element => {
      return element.id === id;
    });
  }

  push(factoryName, content) {
    this.checkFactoryPresence(factoryName);

    const factory = this.factoryFor(factoryName);
    let records = this.store[factoryName] || [];

    if (!Array.isArray(content)) {
      content = [content];
    }

    records.push(...content);

    this.store[factoryName] = records;
  }

  filter(factoryName, filterFunc) {
    this.checkFactoryPresence(factoryName);

    return this.store[factoryName].filter(filterFunc);
  } 

  checkFactoryPresence(name) {
    const factory = this.factoryFor(name);
    if (!factory) throw Error(`Factory ${name} not found`);
  }

  all(factoryName) {
    return this.store[factoryName];
  }

  factoryFor(factoryName) {
    return this.factories[factoryName];
  }

  decorateFactory(factoryName, record) {
    record.id = this.uuid('factoryName');
    return record;
  }

  uuid(factoryName) {
    let id = this._uuids[factoryName] || 0;

    id++;
    this._uuids[factoryName] = id;

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