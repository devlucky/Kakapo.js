import test from 'tape';
import { Database, Router, Server } from '../../src';

export const serverSpec = () => {
  // @TODO Test Server's config

  test('Server # use', (assert) => {
    const myDB = new Database();
    const router = new Router();
    const server = new Server();

    router.get('/posts', (request, db) => {
      assert.ok(db == myDB, 'The passed db is the correct one');
      assert.end();
    });

    server.use(myDB);
    server.use(router);

    fetch('/posts');
  });
};
