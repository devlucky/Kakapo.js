import { Server, Router } from '../src';

describe.skip('Router', () => {
  test('Router # config # host', () => {
    expect.assertions(7);

    // TODO: Create multiple servers at the same time with different
    // 'host' and check that works properly
    const server = new Server();
    const router = new Router({
      host: 'https://api.github.com',
    });

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    server.use(router);

    fetch('https://api.github.com/comments').then(response => {
      expect(response instanceof Response).toBeTruthy();
      expect(response.ok).toBeTruthy();
    });

    fetch('/comments').then(response => {
      expect(response instanceof Response).toBeTruthy();
      // expect.notOk(response.ok, 'Route not found, since it doesn\'t exist.');
    });
  });

  test('Router # config # requestDelay', () => {
    expect.assertions(4);

    const server = new Server();
    const router = new Router({
      requestDelay: 1000,
    });

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    server.use(router);

    fetch('/comments').then(response => {
      expect(response instanceof Response).toBeTruthy();
      expect(response.ok).toBeTruthy();
    });
  });

  test('Router#get', () => {
    expect.assertions(9);

    const server = new Server();
    const router = new Router();

    router.get('/comments', request => {
      expect(typeof request, 'object', 'Request is present.');
    });

    router.get('/users/:user_id', request => {
      expect(typeof request, 'object', 'Request is present.');
      expect(typeof request.params, 'object', 'Params are present');

      return {
        users: [{ firstName: 'hector' }],
      };
    });

    server.use(router);

    fetch('/doesnt_exist')
      .then(response => {
        expect(response instanceof Response, 'Response instance is returned');
      });

    fetch('/comments')
      .then(response => {
        expect(response instanceof Response, 'Response instance is returned');
      });

    fetch('/users/1')
      .then(response => {
        expect(response instanceof Response, 'Response instance is returned');

        return response.json();
      })
      .then(response => {
        const firstName = response.users[0].firstName;
        expect(firstName, 'hector', 'Fake response is returned');
      });
  });

  test('Router#post', () => {
    expect.assertions(6);

    const server = new Server();
    const router = new Router();
    const body = JSON.stringify({ firstName: 'Joan', lastName: 'Romano' });

    router.post('/users', request => {
      const parsedBody = JSON.parse(request.body);
      const firstName = parsedBody.firstName;

      expect(typeof request, 'object', 'Request is present.');
      expect(request.body, body, 'Expected request body is returned');
      expect(firstName, 'Joan', 'Request body has expected values.');

      return {
        status: 'success',
        record: parsedBody,
      };
    });

    server.use(router);

    fetch('/users', { method: 'POST', body })
      .then(r => r.json())
      .then(response => {
        const status = response.status;
        const firstName = response.record.firstName;

        expect(typeof response, 'object', 'Response is present.');
        expect(status, 'success', 'Expected status is returned');
        expect(firstName, 'Joan', 'Response body has expected values.');
      });
  });

  test('Router # post # XMLHttpRequest', () => {
    expect.assertions(1);

    const server = new Server();
    const router = new Router();
    const body = JSON.stringify({ firstName: 'Joan', lastName: 'Romano' });

    router.post('/hector', request => {
      const body = JSON.parse(request.body);
      
      expect(body.firstName, 'Joan', 'Request body has expected values when using XMLHttpRequest');
    });

    server.use(router);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {};
    xhr.open('POST', '/hector', true);
    xhr.send(body);
  });

  test('Router#put', () => {
    expect.assertions(6);

    const server = new Server();
    const router = new Router();

    router.put('/users', request => {
      const query = request.query;
      const page = query.page;

      expect(typeof request, 'object', 'Request is present.');
      expect(typeof query, 'object', 'Request query is returned.');
      expect(page, '1', 'Request query has expected values.');

      return {
        status: 'success',
        query,
      };
    });

    server.use(router);

    fetch('/users?page=1', { method: 'PUT' })
      .then(r => r.json())
      .then(response => {
        const status = response.status;
        const page = response.query.page;

        expect(typeof response, 'object', 'Response is present.');
        expect(status, 'success', 'Expected status is returned');
        expect(page, '1', 'Response body has expected values.');
      });
  });

  test('Router#delete', () => {
    expect.assertions(6);

    const server = new Server();
    const router = new Router();

    router.delete('/users/:user_id/comments/:comment_id', request => {
      const params = request.params;
      const commentId = request.params.comment_id;

      expect(typeof request, 'object', 'Request is present.');
      expect(typeof params, 'object', 'Request params are present.');
      expect(commentId, '2', 'Request params have expected values.');

      return {
        status: 'success',
        params,
      };
    });

    server.use(router);

    fetch('/users/1/comments/2', { method: 'DELETE' })
      .then(r => r.json())
      .then(response => {
        const status = response.status;
        const userId = response.params.user_id;

        expect(typeof response, 'object', 'Response is present.');
        expect(status, 'success', 'Expected status is returned.');
        expect(userId, '1', 'Response body has expected values.');
      });
  });

  test('Router#XMLHttpRequest # config # requestDelay', () => {
    expect.assertions(1);

    const server = new Server();
    const router = new Router({
      requestDelay: 1000,
    });

    router.get('/comments', request => {
      expect(typeof request, 'object', 'Request is present.');
    });

    server.use(router);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {};
    xhr.open('GET', '/comments', true);
    xhr.send();
    
    expect.timeoutAfter(1100);
  });    
  
  test('Router#XMLHttpRequest', () => {
    expect.assertions(10);

    const server = new Server();
    const router = new Router();

    router.get('/comments', request => {
      const params = request.params;

      expect(typeof request, 'object', 'Request is present.');
      expect(typeof params, 'object', 'Request params are present.');

      return [
        { text: 'First comment' },
        { text: 'Second comment' },
      ];
    });

    server.use(router);

    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) { return; }

      const response = xhr.responseText;

      expect(typeof response, 'string', 'Response is present.');
    };
    xhr.open('GET', '/doesnt_exist', true);
    xhr.send();

    xhr2.onreadystatechange = function() {
      if (xhr2.readyState !== 4 || xhr2.status !== 200) { return; }

      const response = xhr2.responseText;
      const texts = response;
      const responseObject = JSON.parse(response);

      expect(this.readyState, xhr2.readyState);
      expect(this.responseText, xhr2.responseText);
      expect(typeof response, 'string', 'Response is present.');
      expect(typeof responseObject, 'object', 'Response is present.');
      expect(responseObject.length, 2, 'Response body has expected values.');
    };
    xhr2.open('GET', '/comments', true);
    xhr2.send();
  });

  test('Router # Async support', () => {
    expect.assertions(1);

    const server = new Server();
    const router = new Router();

    router.get('/async_endpoint', request => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            body: 'async response'
          });
        }, 1000);
      });
    });

    server.use(router);

    fetch('/async_endpoint').then(r => r.json()).then(response => {
      expect(response.body, 'async response', `Response it's fine for async handlers`);
    });
  });

  // @TODO Test strategies in router.
});
