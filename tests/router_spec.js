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
    assert.plan(6);
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
      assert.ok(response instanceof Response, 'Return a Response instance');
      response.json().then(r => {
        assert.ok(r.users[0].firstName === 'hector', 'The fake response is triggered');
      });
    });
  }); 
  test('Router#post', assert => {
    assert.plan(3);
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
    }).then(r => r.json()).then(r => {
      assert.ok(r.status === 'success' && r.record.firstName === 'Joan', 'The response.json() result is the expected one');
    });
  }); 
  test('Router#put', assert => {
    assert.plan(2);
    router = new Router();
    router.put('/users', (request) => {
      assert.ok(request.query.page === '1', 'The page query param is returned');
    });

    fetch('/users?page=1', {method: 'PUT'}).then(() => {
      assert.ok(true, 'The handler is fired when query params are present');
    });
  }); 
  test('Router#delete', assert => {
    assert.plan(3);
    router = new Router();
    router.delete('/users/:user_id/comments/:comment_id', (request) => {
      assert.ok(request.params.user_id === "1", 'Request params have the expected user_id');
      assert.ok(request.params.comment_id === "2", 'Request params have the expected comment_id');
    });

    fetch('/users/1/comments/2', {method: 'DELETE'}).then(() => {
      assert.ok(true, 'The handler is reached');
    });
  }); 
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