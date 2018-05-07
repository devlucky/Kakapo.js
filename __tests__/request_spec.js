import { Server, Router } from '../src';

test.skip('Request # headers', () => {
  expect.assertions(2);

  const server = new Server();
  const router = new Router();

  router.post('/users', (request) => {
    expect(request.headers.get('custom-request-header-1')).toEqual('one');
    expect(request.headers.get('custom-request-header-2')).toEqual('two');
  });

  server.use(router);

  // TODO: Headers is undefined in jsdom
  const headers = new Headers({
    'custom-request-header-1': 'one',
    'custom-request-header-2': 'two',
  });

  const options = {
    method: 'POST',
    headers,
  };

  fetch('/users', options);
});

// @TODO: Test explicitly the contents of request.params
// @TODO: Test explicitly the contents of request.query