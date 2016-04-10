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
};
