import { Server, KakapoResponse, Router } from '../src';

// TODO: stub native Response
describe.skip('Response', () => {
  test('Response # body', () => {
    expect.assertions(2);

    const server = new Server();
    const router = new Router();

    router.get(
      '/users/:id',
      request =>
        new KakapoResponse(200, { id: request.params.id, type: 'user' })
    );

    server.use(router);

    fetch('/users/1')
      .then(r => r.json())
      .then(result => {
        expect(result.id).toEqual('1');
        expect(result.type).toEqual('user');
      });
  });

  test('Response # headers', assert => {
    expect.assertions(4);

    const server = new Server();
    const router = new Router();

    router.get(
      '/users/:id',
      () =>
        new KakapoResponse(
          200,
          {},
          { 'x-header-1': 'one', 'x-header-2': 'two' }
        )
    );

    server.use(router);

    fetch('/users/1').then(result => {
      expect(result.headers.get('x-header-1')).toEqual('one');
      expect(result.headers.get('x-header-2')).toEqual('two');
    });

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        expect(this.getResponseHeader('x-header-1')).toEqual('one');
        expect(this.getResponseHeader('x-header-2')).toEqual('two');
      }
    };

    xhr.open('GET', '/users/1', true);
    xhr.send();
  });

  test('Response # error', assert => {
    const response = new KakapoResponse(404, {}, { 'x-header-1': 'one' });

    expect(response.error).toBeTruthy();
  });

  test('Response # ok', assert => {
    const response = new KakapoResponse(204, {}, { 'x-header-1': 'one' });

    expect(response.ok).toBeTruthy();
  });

  test('Response # code', assert => {
    expect.assertions(2);

    const server = new Server();
    const router = new Router();
    const responsePayload = { status: 'error' };

    router.get('/users', request => new KakapoResponse(400, responsePayload));

    server.use(router);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        expect(xhr.status).toEqual(400);
        expect(xhr.responseText).toEqual(JSON.stringify(responsePayload));
      }
    };
    xhr.open('GET', '/users', true);
    xhr.send();
  });
});
