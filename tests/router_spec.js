import test from 'tape';
import {Router} from '../src/kakapo';

export default () => {
  test('Router#config', assert => {
    const router = new Router({
      host: 'custom'
    });

    assert.end();
  });

  test('Router#get', assert => {
    assert.plan(9);

    const router = new Router();

    router.get('/comments', request => {
      assert.equal(typeof request, 'object', 'Request is present.');
    });

    router.get('/users/:user_id', request => {
      assert.equal(typeof request, 'object', 'Request is present.');
      assert.equal(typeof request.params, 'object', 'Params are present');

      return {
        users: [{firstName: 'hector'}]
      };
    });

    fetch('fixtures.json').then(response => {
      assert.ok(true, 'Handler is fired by native function.');
      assert.ok(response instanceof Response, 'Response instance is returned');
    });

    fetch('/comments').then(response => {
      assert.ok(true, 'Handler is fired by fake function.');
      assert.ok(response instanceof Response, 'Response instance is returned');
    });

    fetch('/users/1').then(response => {
      assert.ok(response instanceof Response, 'Response instance is returned');
      response.json().then(response => {
        const firstName = response.users[0].firstName;
        assert.equal(firstName, 'hector', 'Fake response is returned');
      });
    });
  });

  test('Router#post', assert => {
    assert.plan(6);

    const router = new Router();
    const body = JSON.stringify({firstName: 'Joan', lastName: 'Romano'});

    router.post('/users', request => {
      const parsedBody = JSON.parse(request.body);
      const firstName = parsedBody.firstName;

      assert.equal(typeof request, 'object', 'Request is present.');
      assert.equal(request.body, body, 'Expected request body is returned');
      assert.equal(firstName, 'Joan', 'Request body has expected values.');

      return {
        status: 'success',
        record: parsedBody
      };
    });

    fetch('/users', { method: 'POST', body })
      .then(response => response.json())
      .then(response => {
        const status = response.status;
        const firstName = response.record.firstName;

        assert.equal(typeof response, 'object', 'Response is present.');
        assert.equal(status, 'success', 'Expected status is returned');
        assert.equal(firstName, 'Joan', 'Response body has expected values.');
      });
  });

  test('Router#put', assert => {
    assert.plan(6);

    const router = new Router();

    router.put('/users', request => {
      const query = request.query;
      const page = query.page;

      assert.equal(typeof request, 'object', 'Request is present.');
      assert.equal(typeof query, 'object', 'Request query is returned.');
      assert.equal(page, '1', 'Request query has expected values.');

      return {
        status: 'success',
        query
      };
    });

    fetch('/users?page=1', { method: 'PUT' })
      .then(response => response.json())
      .then(response => {
        const status = response.status;
        const page = response.query.page;

        assert.equal(typeof response, 'object', 'Response is present.');
        assert.equal(status, 'success', 'Expected status is returned');
        assert.equal(page, '1', 'Response body has expected values.');
      });
  });

  test('Router#delete', assert => {
    assert.plan(6);

    const router = new Router();

    router.delete('/users/:user_id/comments/:comment_id', request => {
      const params = request.params;
      const commentId = request.params.comment_id;

      assert.equal(typeof request, 'object', 'Request is present.');
      assert.equal(typeof params, 'object', 'Request params are present.');
      assert.equal(commentId, '2', 'Request params have expected values.');

      return {
        status: 'success',
        params
      };
    });

    fetch('/users/1/comments/2', { method: 'DELETE' })
      .then(response => response.json())
      .then(response => {
        const status = response.status;
        const userId = response.params.user_id;

        assert.equal(typeof response, 'object', 'Response is present.');
        assert.equal(status, 'success', 'Expected status is returned.');
        assert.equal(userId, '1', 'Response body has expected values.');
      });
  });

  test('Router#XMLHttpRequest', assert => {
    assert.plan(8);

    const router = new Router();
    router.get('/comments', request => {
      const params = request.params;

      assert.equal(typeof request, 'object', 'Request is present.');
      assert.equal(typeof params, 'object', 'Request params are present.');

      return [
        {text: 'First comment'},
        {text: 'Second comment'}
      ];
    });

    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const userIds = response.user_ids;

        assert.ok(true, 'Handler is fired by a native function.');
        assert.equal(typeof response, 'object', 'Response is present.');
        assert.equal(userIds.length, 3, 'Response body has expected values.');
      }
    };
    xhr.open('GET', 'fixtures.json', true);
    xhr.send();

    xhr2.onreadystatechange = () => {
      if (xhr2.readyState === 4 && xhr2.status === 200) {
        const response = xhr2.responseText;
        const texts = response;

        assert.ok(true, 'Handler is fired by a fake function.');
        assert.equal(typeof response, 'object', 'Response is present.');
        assert.equal(texts.length, 2, 'Response body has expected values.');
      }
    };
    xhr2.open('GET', '/comments', true);
    xhr2.send();
  });

  test('Router#strategies', assert => {
    const strategies = ['fetch'];
    const router = new Router({strategies});

    assert.end();
  });
};
