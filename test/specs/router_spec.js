import test from 'tape';
import { Router } from '../../src';

export const routerSpec = () => {
  // test('Router # config # host', (assert) => {
  //   assert.plan(7);

  //   const router = new Router({
  //     host: 'https://api.github.com',
  //   });

  //   router.get('/comments', request => {
  //     assert.comment('router GET /comments');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //   });

  //   fetch('https://api.github.com/comments').then(response => {
  //     assert.comment('fetch GET https://api.github.com/comments');
  //     assert.ok(true, 'Handler is fired by fake function.');
  //     assert.ok(response instanceof Response, 'Response instance is returned');
  //     assert.ok(response.ok, 'Route found, since it exists.');
  //   });

  //   fetch('/comments').then(response => {
  //     assert.comment('fetch GET /comments');
  //     assert.ok(true, 'Handler is fired by native function.');
  //     assert.ok(response instanceof Response, 'Response instance is returned');
  //     assert.notOk(response.ok, 'Route not found, since it doesn\'t exist.');
  //   });
  // });

  // test('Router # config # requestDelay', (assert) => {
  //   assert.plan(4);

  //   const router = new Router({
  //     requestDelay: 1000,
  //   });

  //   router.get('/comments', request => {
  //     assert.comment('router GET /comments');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //   });

  //   fetch('/comments').then(response => {
  //     assert.comment('fetch GET /comments');
  //     assert.ok(true, 'Handler is fired by delayed fake function.');
  //     assert.ok(response instanceof Response, 'Response instance is returned');
  //     assert.ok(response.ok, 'Route found, since it exists.');
  //   });
  // });

  // test('Router#get', (assert) => {
  //   assert.plan(9);
  //   const router = new Router();

  //   router.get('/comments', request => {
  //     assert.comment('router GET /comments');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //   });

  //   router.get('/users/:user_id', request => {
  //     assert.comment('router GET /users/:user_id');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //     assert.equal(typeof request.params, 'object', 'Params are present');

  //     return {
  //       users: [{ firstName: 'hector' }],
  //     };
  //   });

  //   fetch('/doesnt_exist')
  //     .then(response => {
  //       assert.comment('fetch GET /doesnt_exist');
  //       assert.ok(true, 'Handler is fired by native function.');
  //       assert.ok(response instanceof Response, 'Response instance is returned');
  //     });

  //   fetch('/comments')
  //     .then(response => {
  //       assert.comment('fetch GET /comments');
  //       assert.ok(true, 'Handler is fired by fake function.');
  //       assert.ok(response instanceof Response, 'Response instance is returned');
  //     });

  //   fetch('/users/1')
  //     .then(response => {
  //       assert.comment('fetch GET /users/1');
  //       assert.ok(response instanceof Response, 'Response instance is returned');

  //       return response.json();
  //     })
  //     .then(response => {
  //       const firstName = response.users[0].firstName;
  //       assert.equal(firstName, 'hector', 'Fake response is returned');
  //     });
  // });

  // test('Router#post', (assert) => {
  //   assert.plan(6);
  //   const router = new Router();
  //   const body = JSON.stringify({ firstName: 'Joan', lastName: 'Romano' });

  //   router.post('/users', request => {
  //     const parsedBody = JSON.parse(request.body);
  //     const firstName = parsedBody.firstName;

  //     assert.comment('router POST /users');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //     assert.equal(request.body, body, 'Expected request body is returned');
  //     assert.equal(firstName, 'Joan', 'Request body has expected values.');

  //     return {
  //       status: 'success',
  //       record: parsedBody,
  //     };
  //   });

  //   fetch('/users', { method: 'POST', body })
  //     .then(r => r.json())
  //     .then(response => {
  //       const status = response.status;
  //       const firstName = response.record.firstName;

  //       assert.comment('fetch POST /users');
  //       assert.equal(typeof response, 'object', 'Response is present.');
  //       assert.equal(status, 'success', 'Expected status is returned');
  //       assert.equal(firstName, 'Joan', 'Response body has expected values.');
  //     });
  // });

  // test('Router#put', (assert) => {
  //   assert.plan(6);
  //   const router = new Router();

  //   router.put('/users', request => {
  //     const query = request.query;
  //     const page = query.page;

  //     assert.comment('router PUT /users');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //     assert.equal(typeof query, 'object', 'Request query is returned.');
  //     assert.equal(page, '1', 'Request query has expected values.');

  //     return {
  //       status: 'success',
  //       query,
  //     };
  //   });

  //   fetch('/users?page=1', { method: 'PUT' })
  //     .then(r => r.json())
  //     .then(response => {
  //       const status = response.status;
  //       const page = response.query.page;

  //       assert.comment('fetch PUT /users?page=1');
  //       assert.equal(typeof response, 'object', 'Response is present.');
  //       assert.equal(status, 'success', 'Expected status is returned');
  //       assert.equal(page, '1', 'Response body has expected values.');
  //     });
  // });

  // test('Router#delete', (assert) => {
  //   assert.plan(6);
  //   const router = new Router();

  //   router.delete('/users/:user_id/comments/:comment_id', request => {
  //     const params = request.params;
  //     const commentId = request.params.comment_id;

  //     assert.comment('router DELETE /users/:user_id/comments/:comment_id');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //     assert.equal(typeof params, 'object', 'Request params are present.');
  //     assert.equal(commentId, '2', 'Request params have expected values.');

  //     return {
  //       status: 'success',
  //       params,
  //     };
  //   });

  //   fetch('/users/1/comments/2', { method: 'DELETE' })
  //     .then(r => r.json())
  //     .then(response => {
  //       const status = response.status;
  //       const userId = response.params.user_id;

  //       assert.comment('fetch DELETE /users/1/comments/2');
  //       assert.equal(typeof response, 'object', 'Response is present.');
  //       assert.equal(status, 'success', 'Expected status is returned.');
  //       assert.equal(userId, '1', 'Response body has expected values.');
  //     });
  // });

  // test('Router#XMLHttpRequest#interception', (assert) => {
  //   assert.plan(7);
  //   const router = new Router();

  //   router.get('/comments', request => {
  //     const params = request.params;

  //     assert.comment('router GET /comments');
  //     assert.equal(typeof request, 'object', 'Request is present.');
  //     assert.equal(typeof params, 'object', 'Request params are present.');

  //     return [
  //       { text: 'First comment' },
  //       { text: 'Second comment' },
  //     ];
  //   });

  //   const xhr = new XMLHttpRequest();
  //   const xhr2 = new XMLHttpRequest();

  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState !== 4) { return; }

  //     const response = xhr.responseText;

  //     assert.comment('xhr GET doesnt_exist');
  //     assert.ok(true, 'Handler is fired by a native function.');
  //     assert.equal(typeof response, 'string', 'Response is present.');
  //   };
  //   xhr.open('GET', '/doesnt_exist', true);
  //   xhr.send();

  //   xhr2.onreadystatechange = () => {
  //     if (xhr2.readyState !== 4 || xhr2.status !== 200) { return; }

  //     const response = xhr2.responseText;
  //     const texts = response;

  //     assert.comment('xhr GET /comments');
  //     assert.ok(true, 'Handler is fired by a fake function.');
  //     assert.equal(typeof response, 'object', 'Response is present.');
  //     assert.equal(texts.length, 2, 'Response body has expected values.');
  //   };
  //   xhr2.open('GET', '/comments', true);
  //   xhr2.send();
  // });

  test('Router#XMLHttpRequest#functionality', (assert) => {
    const router = new Router();
    const xhr = new XMLHttpRequest();

    debugger
  });
  // @TODO Test strategies in router.
};
