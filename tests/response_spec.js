import tapeTest from 'tape';
import {Router, Response} from '../src/kakapo';

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

export default () => {
  test('Response#code', assert => {
    assert.plan(2);
    router = new Router();
  
    router.get('/users/:id', (request) => {
      const code = request.params.id == 1 ? 200 : 400;

      return new Response(code);
    });

    fetch('/users/1').then(() => {
      assert.ok(true, 'Enter in the success handler');
    });

    //TODO: Check error arguments
    fetch('/users/2').catch(() => {
      assert.ok(true, 'Enter in the error handler');
    });
  });
  test('Response#body', assert => {
    assert.plan(1);
    router = new Router();
  
    router.get('/users/:id', (request) => {
      return new Response(200, {id: request.params.id, type: 'user'});
    });

    fetch('/users/1').then(r => r.json()).then(r => {
      assert.ok(r.id == 1 && r.type === 'user', 'Response body is the expected one');
    });
  });
  test('Response#headers', assert => {
    assert.plan(2);
    router = new Router();
  
    router.get('/users/:id', (request) => {
      return new Response(200, {}, {'x-header-1': 'one', 'x-header-2': 'two'});
    });

    fetch('/users/1').then(r => {
      assert.ok(r.headers.get('x-header-1') === 'one', 'The first header is correct');
      assert.ok(r.headers.get('x-header-2') === 'two', 'The second header is correct');
    });
  });
};
