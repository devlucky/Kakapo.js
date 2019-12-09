import { Router } from '../Router';
import { Database, DatabaseSchema } from '../Database';

const isRouter = <M extends DatabaseSchema>(entity: any): entity is Router<M> => entity instanceof Router;
const isDb = <M extends DatabaseSchema>(entity: any): entity is Database<M> => entity instanceof Database;

export class Server<M extends DatabaseSchema> {
    db: Database<M> | null = null;
    router: Router<M> | null = null;

    constructor(readonly config: any = {}) {}

    use(entity: Database<M> | Router<M>) {
      if (isDb(entity)) {
        this.db = entity;
      } else if (isRouter(entity)) {
        this.router = entity;
        this.router.intercept();
      } else {
        console.warn(
          `KAKAPO: Server doesn't know how to use the entity ${entity}`
        );
      }

      this.linkEntities();
    }

    remove(entity: Database<M> | Router<M>) {
      if ( isDb(entity) &&
          this.router &&
          this.router.interceptorConfig.db === entity
      ) {
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
