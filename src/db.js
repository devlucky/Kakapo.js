import faker from 'faker';

export class DB {
  constructor() {
    this.setInitialState();
  }

  register(name, factory) {
    this.factories[name] = factory;
  }

  create(factoryName, number) {
    const factory = this.factories[factoryName];
    if (!factory) {
      throw Error(`Factory ${factoryName} not found`);
    }

    let instances = this.store[factoryName] || [];
    while (number) {
      instances.push(this.decorateFactory(factoryName, factory(faker)));
      number--;
    }

    this.store[factoryName] = instances;
  }

  //TODO: throw error if factoryName doesn't exist
  find(factoryName, id) {
    const factory = this.factoryFor(factoryName);
    if (!factory) return;

    return this.store[factoryName].find(element => {
      return element.id === id;
    });
  }

  push(factoryName, content) {
    const factory = this.factoryFor(factoryName);
    if (!factory) return;

    let factoryInstances = this.store[factoryName] || [];

    if (!Array.isArray(content)) {
      content = [content];
    }

    factoryInstances.push(...content);

    this.store[factoryName] = factoryInstances;
  }

  //TODO: throw error if factoryName doesn't exist
  filter(factoryName, filterFunc) {

  }

  factoryFor(factoryName) {
    return this.factories[factoryName];
  }

  decorateFactory(factoryName, instance) {
    instance.id = this.uuid('factoryName');
    return instance;
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