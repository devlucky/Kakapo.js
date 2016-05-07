import test from 'tape';
import { Database, Router, Server } from '../../src';

export const serverSpec = () => {
  // @TODO Test Server's config

  test('Server # use', (assert) => {
    const db = new Database();
    const router = new Router();
    const server = new Server();

    server.use(db);
    server.use(router);

    assert.end();
  });
};
