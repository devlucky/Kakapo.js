import tapeTest from 'tape';
import {Router} from '../src/kakapo';

let router;

const userHandler = () => {

};

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
  test('Router#config', assert => {
    router = new Router({
      host: 'custom'
    });
    assert.end();
  });
  test('Router#get', assert => {
    assert.plan(5);
    router = new Router();
  
    router.get('/comments', () => {
      assert.ok(true, 'comments handler is fired');
    });
    router.get('/users/:user_id', (request) => {
      assert.ok(request.params, 'Request params is present');
      assert.ok(true, 'User handler is fired');

      return {
        users: [{firstName: 'hector'}]
      };
    });

    fetch('fixtures.json').then((response) => {
      assert.ok(response instanceof Response, 'Fires a normal handler');
    });
    fetch('/comments');
    fetch('/users/1').then((response) => {
      assert.ok(response.users[0].firstName === 'hector', 'The fake response is triggered');
    });
  }); 
  // test('Router#post', assert => {
  //   assert.end()
  // }); 
  // test('Router#put', assert => {
  //   assert.end()
  // }); 
  // test('Router#delete', assert => {
  //   assert.end()
  // }); 
  test('Router#XMLHttpRequest', assert => {
    assert.plan(1);
    router = new Router();
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        
      }
    };
    xhr.open("GET", "fixtures.json", true);
    xhr.send();

    assert.end();
  });
  test('Router#strategies', assert => {
    const strategies = ['fetch'];
    router = new Router({strategies});

    assert.end()
  });
  // test('Router#response.params', assert => {
  //   assert.end();
  // });
}