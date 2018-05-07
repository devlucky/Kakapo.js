// @TODO Test Server's config
import { Database, Router, Server } from '../src';

const xhrRequest = (url) => {
  const xhr = new XMLHttpRequest(); 

  xhr.onreadystatechange = () => {};
  xhr.open('GET', url, true);
  xhr.send();
}

describe.skip('Server', () => {
  test('Server # use database', () => {
    expect.assertions(2);

    const myDB = new Database();
    const router = new Router();
    const server = new Server();

    router.get('/fetch', (request, db) => {
      expect(db == myDB, 'The passed db is the correct one with fetch request');
    });
    router.get('/xhr', (request, db) => {
      expect(db == myDB, 'The passed db is the correct one with xhr request');
    });

    server.use(myDB);
    server.use(router);

    fetch('/fetch');
    xhrRequest('/xhr');
  });

  test('Server # use router', () => {
    const router = new Router();
    const server = new Server();

    router.get('/comments', _ => {
      expect('Should not reach this handler since the request is fired before "server.use"');
    });

    router.get('/users', _ => {
      expect(true, 'It must only enter in this handler since the request has been triggered after the registration');
      expect();
    });

    fetch('/comments');
    server.use(router);
    fetch('/users');
  });

  test('Server # remove database', () => {
    expect.assertions(2);

    const myDB = new Database();
    const router = new Router();
    const server = new Server();

    router.get('/fetch_db', (request, db) => {
      expect(db, myDB, 'The passed db is fine');
    });
    router.get('/fetch_nodb', (request, db) => {
      expect(db, null, 'The passed db is undefined since we have been removed it from the server');
    });

    server.use(myDB);
    server.use(router);
    fetch('/fetch_db');

    server.remove(myDB);
    fetch('/fetch_nodb');
  });
  
  test('Server # remove router', () => {
    expect.assertions(2);

    const router = new Router();
    const server = new Server();

    router.get('/fetch', _ => {
      expect(true, 'Server is active before being removed');
    });
    router.get('/fetch_fail', _ => {
      expect('Request is being intercepted when router is removed');
    });

    server.use(router);
    fetch('/fetch');

    server.remove(router);
    fetch('/fetch_fail').then(response => {
      expect(response.status, 404, 'Server is inactive after removal');
    });
  });
});
