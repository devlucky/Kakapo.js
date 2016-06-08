import test from 'tape';
import 'whatwg-fetch';
// import {Server, Router} from '../../../src';

// const server = new Server();
// const router = new Router();
// const response = [{name: 'Hector'}];
// const checkResponse = (assert, response) => assert.equal(response[0].name, 'Hector', 'Return the right response');

// router.get('/users', request => response)
// router.post('/users', request => response);
// server.use(router);

export const fetchPolyfillSpec = () => {
  test('Integration # FetchPolyfill # get', (assert) => {
    assert.plan(1);
    debugger
    fetch('/users').then(r => r.json()).then(r => {
      checkResponse(assert, r);
    });
  });
};