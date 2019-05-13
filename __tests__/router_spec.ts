import { Server, Router, KakapoResponse } from '../src';

describe('Router', () => {
  test('Router # config # host', async () => {
    // TODO: Create multiple servers at the same time with different
    // 'host' and check that works properly
    const server = new Server();
    const router = new Router({
      host: 'https://api.github.com'
    });

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    server.use(router);

    const response = await fetch('https://api.github.com/comments');

    expect(response).toBeInstanceOf(Response);
    expect(response.ok).toBeTruthy();

    const response2 = await fetch('/comments');
    expect(response).toBeInstanceOf(Response);
  });

  test('Router # config # requestDelay', async () => {
    const server = new Server();
    const router = new Router({
      requestDelay: 1000
    });

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    server.use(router);

    const response = await fetch('/comments');

    expect(response instanceof Response).toBeTruthy();
    expect(response.ok).toBeTruthy();
  });

  test('Router#get', async () => {
    const server = new Server();
    const router = new Router();

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    router.get('/users/:user_id', request => {
      expect(typeof request).toEqual('object');
      expect(typeof request.params).toEqual('object');

      return {
        users: [{ firstName: 'hector' }]
      };
    });

    server.use(router);

    expect(await fetch('/doesnt_exist')).toBeInstanceOf(Response);
    expect(await fetch('/comments')).toBeInstanceOf(Response);

    return fetch('/users/1')
      .then(response => {
        expect(response).toBeInstanceOf(Response);
        return response.json();
      })
      .then(response => {
        const firstName = response.users[0].firstName;
        expect(firstName).toEqual('hector');
      });
  });

  test('Router#post', async () => {
    const server = new Server();
    const router = new Router();
    const body = JSON.stringify({ firstName: 'Joan', lastName: 'Romano' });

    router.post('/users', request => {
      const parsedBody = JSON.parse(request.body);
      const firstName = parsedBody.firstName;

      expect(request.body).toEqual(body);
      expect(firstName).toEqual('Joan');

      return {
        status: 'success',
        record: parsedBody
      };
    });

    server.use(router);

    const response = await (await fetch('/users', {
      method: 'POST',
      body
    })).json();
    const status = response.status;
    const firstName = response.record.firstName;

    expect(status).toEqual('success');
    expect(firstName).toEqual('Joan');
  });

  test('Router # post # XMLHttpRequest', () => {
    const server = new Server();
    const router = new Router();
    const body = JSON.stringify({ firstName: 'Joan', lastName: 'Romano' });

    router.post('/hector', request => {
      const body = JSON.parse(request.body);

      expect(body.firstName).toEqual('Joan');
    });

    server.use(router);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {};
    xhr.open('POST', '/hector', true);
    xhr.send(body);
  });

  test('Router#put', async () => {
    const server = new Server();
    const router = new Router();

    router.put('/users', request => {
      const query = request.query;
      const page = query.page;

      expect(page).toEqual('1');

      return {
        status: 'success',
        query
      };
    });

    server.use(router);

    const response = await (await fetch('/users?page=1', {
      method: 'PUT'
    })).json();
    const status = response.status;
    const page = response.query.page;

    expect(status).toEqual('success');
    expect(page).toEqual('1');
  });

  test('Router#delete', async () => {
    const server = new Server();
    const router = new Router();

    router.delete('/users/:user_id/comments/:comment_id', request => {
      const params = request.params;
      const commentId = request.params.comment_id;

      expect(commentId).toEqual('2');

      return {
        status: 'success',
        params
      };
    });

    server.use(router);

    const response = await (await fetch('/users/1/comments/2', {
      method: 'DELETE'
    })).json();
    const status = response.status;
    const userId = response.params.user_id;

    expect(status).toEqual('success');
    expect(userId).toEqual('1');
  });

  test('Router#XMLHttpRequest # config # requestDelay', () => {
    const server = new Server();
    const router = new Router({
      requestDelay: 10
    });

    router.get('/comments', request => {
      expect(typeof request).toEqual('object');
    });

    server.use(router);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {};
    xhr.open('GET', '/comments', true);
    xhr.send();
  });

  test.skip('Router#XMLHttpRequest', () => {
    const server = new Server();
    const router = new Router();

    router.get('/comments', request => {
      const params = request.params;

      expect(typeof request).toEqual('object');
      expect(typeof params).toEqual('object');

      return [{ text: 'First comment' }, { text: 'Second comment' }];
    });

    server.use(router);

    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      const response = xhr.responseText;

      expect(typeof response).toEqual('string');
    };
    xhr.open('GET', '/doesnt_exist', true);
    xhr.send();

    xhr2.onreadystatechange = function() {
      if (xhr2.readyState !== 4 || xhr2.status !== 200) {
        return;
      }

      const response = xhr2.responseText;
      const texts = response;
      const responseObject = JSON.parse(response);

      expect(this.readyState).toEqual(xhr2.readyState);
      expect(this.responseText).toEqual(xhr2.responseText);
      expect(typeof response).toEqual('string');
      expect(typeof responseObject).toEqual('object');
      expect(responseObject.length).toEqual(2);
    };
    xhr2.open('GET', '/comments', true);
    xhr2.send();
  });

  test('Router # Async support', async () => {
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

    const response = await (await fetch('/async_endpoint')).json();

    expect(response.body).toEqual('async response');
  });

  test('Router # Fetch # Content-Type image/svg+xml', async () => {
    const server = new Server();
    const router = new Router();

    const svgData = 'svgData';

    router.get('/svg_content', request => {
      return new KakapoResponse(200, svgData, {
        'content-type': 'image/svg+xml'
      });
    });

    server.use(router);

    const response = await fetch('/svg_content');

    expect(response.body).toEqual(svgData);
  });

  test('Router # Fetch # No Content Type', async () => {
    const server = new Server();
    const router = new Router();
    const expectedResponse = { foo: 'bar' };

    router.get('/json_content', request => {
      return new KakapoResponse(200, expectedResponse);
    });

    server.use(router);

    const response = await fetch('/json_content');

    expect(response.json()).resolves.toEqual(expectedResponse);
  });

  test('Router # Fetch # Content Type application/json', async () => {
    const server = new Server();
    const router = new Router();
    const expectedResponse = { foo: 'bar' };

    router.get('/json_content', request => {
      return new KakapoResponse(200, expectedResponse, {
        'content-type': 'application/json'
      });
    });

    server.use(router);

    const response = await fetch('/json_content');

    expect(response.body).toEqual(JSON.stringify(expectedResponse));
  });
  // @TODO Test strategies in router.
});
