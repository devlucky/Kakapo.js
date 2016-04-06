import tapeTest from 'tape';
import {DB} from '../src/kakapo';

const userFactory = () => {
  return {
    firstName: 'hector',
    lastName: 'zarco'
  };
}

const commentFactory = () => {
  return {
    text: 'foo',
    likes: 3
  };
}

function before() {

};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export default () => {
  test('DB#register', assert => {
    const db = new DB();
    db.register('user', userFactory);
      
    assert.ok(typeof db.factoryFor('user') === 'function', 'The factory is registered properly');
    assert.end();
  });

  test('DB#create', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.register('comment', commentFactory);
    db.create('user', 5);
    db.create('comment', 1);

    assert.ok(db.store.user.length === 5, 'Users are created');
    assert.ok(db.store.comment.length === 1, 'Comments are created');

    db.create('user', 2);

    assert.ok(db.store.user.length === 7, 'New users are there');
    assert.ok(db.store.comment.length === 1, 'Comment has the same length');
    assert.end();
  });

  test('DB#find', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.create('user', 5);
    const user = db.find('user', 2);

    assert.ok(user.id === 2 && user.firstName === 'hector', 'Finds the second user');
    assert.end();
  });

  test('DB#push', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.push('user', userFactory());
    db.push('user', [userFactory(), userFactory()]);
    assert.end();
  });

  test('DB#reset', assert => {
    assert.end();
  });
}