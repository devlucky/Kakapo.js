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
  test('Router#post', assert => {
    assert.plan(2);
    router = new Router();
    const body = JSON.stringify({firstName: 'Joan', lastName: 'Romano'});
    router.post('/users', (request) => {
      const parsedBody = JSON.parse(request.body);
      assert.ok(request.body === body, 'Return the expected request body');
      assert.ok(parsedBody.firstName === 'Joan', 'The user firstName matches the expect value');
      
      return {
        status: 'success',
        record: parsedBody
      };
    });

    fetch('/users', {
      method: 'POST',
      body
    }).then((response) => {
      
    });

    fetch('fixtures.json').then((response) => {
      
    });
  }); 
  // test('Router#put', assert => {
  //   assert.end()
  // }); 
  // test('Router#delete', assert => {
  //   assert.end()
  // }); 
  test('Router#XMLHttpRequest', assert => {
    assert.plan(6);

    router = new Router();
    router.get('/comments', (request) => {
      assert.ok(request.params, 'Request params is present');
      assert.ok(true, 'Comment handler is reached');

      return [
        {text: 'First comment'},
        {text: 'Second comment'}
      ];
    });

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        assert.ok(true, 'Fires a normal handler using XMLHttpRequest');
        assert.ok(response.user_ids.length === 3, 'Return the real data');
      }
    };
    xhr.open('GET', 'fixtures.json', true);
    xhr.send();

    let xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = () => {
      if (xhr2.readyState === 4 && xhr2.status === 200) {
        assert.ok(true, 'Fires a fake handler using XMLHttpRequest');
        assert.ok(xhr2.responseText[0].text === 'First comment', 'Return the fake data as responseText');
      }
    };
    xhr2.open('GET', '/comments', true);
    xhr2.send();    
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