import {Router, Database} from '../index';

export class Server {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.router = null;
  }

  use(entity) {
    if (entity instanceof Database) {
      this.db = entity;
    } else if (entity instanceof Router) {
      this.router = entity;
      //TODO: Is in this moment when the router should start intercepting requests
    } else {
      console.warn(`KAKAPO: Server doesn't know how to use the entity ${entity}`);
    }

    this.linkEntities();
  }

  linkEntities() {
    const router = this.router;
    const db = this.db;

    if (router && db && router.interceptorConfig.db !== db) {
      router.interceptorConfig.db = db;
    }
  }
}