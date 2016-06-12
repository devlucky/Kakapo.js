import test from 'tape';
import $ from 'jquery';
import {Server, Router} from '../../../src';

const server = new Server();
const router = new Router();
const response = [{name: 'Hector'}];
const checkResponse = (assert, response) => assert.equal(response[0].name, 'Hector', 'Return the right response');

router.get('/users', request => response)
router.post('/users', request => response);
server.use(router);

export const jquerySpec = () => {
  test('Integration # jQuery # get', (assert) => {
    assert.plan(1);

    $.get('/users').then(r => {
      checkResponse(assert, r);
    });
  });
  test('Integration # jQuery # getJSON', (assert) => {
    assert.plan(1);

    $.getJSON('/users').then(r => {
      checkResponse(assert, r);
    });
  });
  test('Integration # jQuery # post', (assert) => {
    assert.plan(1);

    $.post('/users').then(r => {
      checkResponse(assert, r);
    });
  });
  test('Integration # jQuery # ajax', (assert) => {
    assert.plan(3);

    $.ajax({
      url: '/users',
      success(r) {
        checkResponse(assert, r);
      }
    });
    $.ajax({
      url: '/users',
      method: 'POST',
      success(r) {
        checkResponse(assert, r);
      }
    });
    $.ajax({
      url: '/users',
      method: 'POST',
      success(r) {
        checkResponse(assert, r);
      },
      dataType: 'json'
    });
  });
  test('Integration # jQuery # params', assert => {
    assert.plan(1);

    const server = new Server();
    const router = new Router();

    router.get('/params_test', request => {
      assert.equal(request.query.param1, 'foo', 'Query params is fine');
    });

    server.use(router);

    $.get('/params_test', {param1: 'foo'});
  });
  test('Integration # jQuery # post # body', assert => {
    assert.plan(2);

    const server = new Server();
    const router = new Router();

    router.post('/body_test', request => {
      assert.equal(request.body, 'foo=bar', 'Body is sent properly');
    });

    server.use(router);

    $.post('/body_test', {foo: 'bar'});
    $.ajax({
      type: "POST",
      url: '/body_test',
      data: {foo: 'bar'}
    });
  });
  test('Integration # jQuery # headers', assert => {
    assert.plan(1);

    const server = new Server();
    const router = new Router();

    router.post('/headers_test', request => {
      assert.equal(request.headers['X-Kakapo-token'], 1234, 'Custom header is received');
    });

    server.use(router);

    $.ajax({
      type: "POST",
      url: '/headers_test',
      headers: {
        'X-Kakapo-token': 1234
      }
    });
  });
};