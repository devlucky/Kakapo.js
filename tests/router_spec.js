import tapeTest from 'tape';
import {Router} from '../src/kakapo';

const userHandler = () => {

};

function before() {

};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export default () => {
  test('Router#get', assert => {
    const router = new Router();

    // router.get('/comments', () => {});
    // router.get('/comments', () => {});
    // router.get('posts', () => {});
    // router.post('comments', () => {});
    router.get('/users', () => {
      assert.ok(1, 'The handler is fired');

      return {
        users: [{firstName: 'hector'}]
      };
    });

    fetch('/users').then((response) => {
      assert.ok(response.users[0].firstName === 'hector', 'The fake response is triggered');
      assert.end();
    });
  }); 
}