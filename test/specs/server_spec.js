import test from 'tape';
import { Database, Router, Server } from '../../src';

//
// TODO: Check the same with XHR
//


export const serverSpec = () => {
  // @TODO Test Server's config

  test('Server # use database', (assert) => {
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

  test('Server # use router', (assert) => {
    const router = new Router();
    const server = new Server();

    router.get('/comments', _ => {
      assert.fail('Should not reach this handler since the request is fired before "server.use"');
    });

    router.get('/users', _ => {
      assert.ok(true, 'It must only enter in this handler since the request has been triggered after the registration');
      assert.end();
    });

    fetch('/comments');
    server.use(router);
    fetch('/users');
  });
};
