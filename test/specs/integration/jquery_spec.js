//TODO: Query params
//TODO: Request headers
//TODO: Request body

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
};