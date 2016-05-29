// @TODO Test Server's config
import test from 'tape';
import { Database, Router, Server } from '../../src';

const xhrRequest = (url) => {
  const xhr = new XMLHttpRequest(); 

  xhr.onreadystatechange = () => {};
  xhr.open('GET', url, true);
  xhr.send();
}

export const serverSpec = () => {
  test('Server # use database', (assert) => {
    assert.plan(2);

    const myDB = new Database();
    const router = new Router();
    const server = new Server();

    router.get('/fetch', (request, db) => {
      assert.ok(db == myDB, 'The passed db is the correct one with fetch request');
    });
    router.get('/xhr', (request, db) => {
      assert.ok(db == myDB, 'The passed db is the correct one with xhr request');
    });

    server.use(myDB);
    server.use(router);

    fetch('/fetch');
    xhrRequest('/xhr');
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
