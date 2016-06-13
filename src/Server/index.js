import {Router} from '../Router';
import {Database} from '../Database';

const isRouter = entity => entity instanceof Router;
const isDb = entity => entity instanceof Database;

export class Server {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.router = null;
  }

  use(entity) {
    if (isDb(entity)) {
      this.db = entity;
    } else if (isRouter(entity)) {
      this.router = entity;
      this.router.intercept();
    } else {
      console.warn(`KAKAPO: Server doesn't know how to use the entity ${entity}`);
    }

    this.linkEntities();
  }

  remove(entity) {
    if (isDb(entity) && this.router && this.router.interceptorConfig.db === entity) {
      this.router.interceptorConfig.db = null;
    } else if (isRouter(entity) && this.router == entity) {
      this.router.reset();
    } else {
      console.warn("KAKAPO: Entity doesn't belongs to server", entity);
    }
  }

  linkEntities() {
    const router = this.router;
    const db = this.db;

    if (router && db && router.interceptorConfig.db !== db) {
      router.interceptorConfig.db = db;
    }
  }
}