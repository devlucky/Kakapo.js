import test from 'tape';
import {Router, Response} from '../../src';

export const responseSpec = () => {
  test('Response#body', assert => {
    assert.plan(1);
    const router = new Router();

    router.get('/users/:id', (request) => {
      return new Response(200, {id: request.params.id, type: 'user'});
    });

    fetch('/users/1').then(r => r.json()).then(r => {
      assert.ok(r.id == 1 && r.type === 'user', 'Response body is the expected one');
    });
  });
  test('Response#headers', assert => {
    assert.plan(2);
    const router = new Router();

    router.get('/users/:id', (request) => {
      return new Response(200, {}, {'x-header-1': 'one', 'x-header-2': 'two'});
    });

    fetch('/users/1').then(r => {
      assert.ok(r.headers.get('x-header-1') === 'one', 'The first header is correct');
      assert.ok(r.headers.get('x-header-2') === 'two', 'The second header is correct');
    });
  });

  test('Response # error', assert => {
    assert.plan(1);
    const response = new Response(404, {}, {'x-header-1': 'one'});
    assert.ok(response.error, 'Is aware of error knowing the status code');
  });

  test('Response # ok', assert => {
    assert.plan(1);
    const response = new Response(204, {}, {'x-header-1': 'one'});
    assert.ok(response.ok, 'Is aware of success knowing the status code');
  });
};
