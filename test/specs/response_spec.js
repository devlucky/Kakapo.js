import test from 'tape';
import { Response, Router } from '../../src';

export const responseSpec = () => {
  test('Response # body', (assert) => {
    assert.plan(2);
    const router = new Router();

    router.get('/users/:id', (request) =>
      new Response(200, { id: request.params.id, type: 'user' })
    );

    fetch('/users/1')
      .then(r => r.json())
      .then(result => {
        assert.equal(result.id, 1, 'Response body id is valid');
        assert.equal(result.type, 'user', 'Response body type is valid');
      });
  });

  test('Response # headers', (assert) => {
    assert.plan(2);
    const router = new Router();

    router.get('/users/:id', () =>
      new Response(200, {}, { 'x-header-1': 'one', 'x-header-2': 'two' })
    );

    fetch('/users/1')
      .then(result => {
        assert.equal(result.headers.get('x-header-1'), 'one',
          'The first header is correct');
        assert.equal(result.headers.get('x-header-2'), 'two',
          'The second header is correct');
      });
  });

  test('Response # error', (assert) => {
    assert.plan(1);
    const response = new Response(404, {}, { 'x-header-1': 'one' });

    assert.ok(response.error, 'Is aware of error knowing the status code');
  });

  test('Response # ok', (assert) => {
    assert.plan(1);
    const response = new Response(204, {}, { 'x-header-1': 'one' });

    assert.ok(response.ok, 'Is aware of success knowing the status code');
  });
};
