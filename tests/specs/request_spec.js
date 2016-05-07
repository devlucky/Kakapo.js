/**
 * What's the request in Kakapo? Check the example
 *
 * import {Server} from 'Kakapo';
 * const server = new Server();
 * server.get('/users', (request) => {
 *   ...
 * });
 *
 * It's an important part of Kakapo since contains useful information for
 * the user in the moment of returning the fake data from the handler.
 *
 * So, even if the behaviour is implicity/explicity tested in other specs,
 * this one must cover all the cases.
 */
import tapeTest from 'tape';
import {Router} from '../../src';

let router;

function before() {
  if (router && router.reset) {
    router.reset();
  }
};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export const requestSpec = () => {
  test('Request#headers', assert => {
    assert.plan(2);
    router = new Router();

    router.post('/users', (request) => {
      assert.ok(request.headers.get('custom-request-header-1') === 'one', 'Receive the first header');
      assert.ok(request.headers.get('custom-request-header-2') === 'two', 'Receive the second header');
    });

    var headers = new Headers({
      'custom-request-header-1': 'one',
      'custom-request-header-2': 'two'
    });
    var options = {
      method: 'POST',
      headers: headers
    };

    fetch('/users', options);
  });
  //TODO: This test should test explicitly the contents of request.params
  test('Request#params', assert => {
    assert.end();
  });
  //TODO: This test should test explicitly the contents of request.query
  test('Request#query', assert => {
    assert.end();
  });
}
