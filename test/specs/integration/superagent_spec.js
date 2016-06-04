//TODO: Query params
//TODO: Request headers
//TODO: Request body
//TODO: Use .type('form')
//TODO: Use .type('application/json')
//TODO: Use .accept('application/json')
//TODO: Use .accept('json')
//TODO: Check res.text --> 
//TODO: Check Response status
//TODO: withCredentials()
//TODO: ERROR Handler - Check on('error')

import test from 'tape';
import request from 'superagent';
import {Server, Router} from '../../../src';

const server = new Server();
const router = new Router();
const response = [{name: 'Hector'}];
const checkResponse = (assert, response) => assert.equal(response.body[0].name, 'Hector', 'Return the right response');

router.get('/users', request => response)
router.post('/users', request => response);
router.put('/users', request => response);
router.delete('/users', request => response);
server.use(router);

export const superagentSpec = () => {
  test('Integration # superagent # get', (assert) => {
    assert.plan(1);

    request.get('/users').end((err, res) => {
      checkResponse(assert, res);
    });
  });

  test('Integration # superagent # post', (assert) => {
    assert.plan(1);

    request.post('/users').end((err, res) => {
      checkResponse(assert, res);
    });
  });

  test('Integration # superagent # put', (assert) => {
    assert.plan(1);

    request.put('/users').end((err, res) => {
      checkResponse(assert, res);
    });
  });

  test('Integration # superagent # del', (assert) => {
    assert.plan(1);

    request.del('/users').end((err, res) => {
      checkResponse(assert, res);
    });
  });

  test('Integration # superagent # get', (assert) => {
    assert.plan(1);

    request('/users', function(err, res){
      checkResponse(assert, res);
    });
  }); 
};