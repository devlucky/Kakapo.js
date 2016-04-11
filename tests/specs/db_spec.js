import tapeTest from 'tape';
import {DB} from '../../src/kakapo';

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

export const databaseSpec = () => {
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
    const user2 = db.find('user', 2);
    const user6 = db.find('user', 6);

    assert.ok(user2.id === 2 && user2.firstName === 'hector', 'Finds the second user');
    assert.ok(!user6, 'Return undefined is no user found');
    assert.end();
  });

  test('DB#filter', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.push('user', {id: 1, firstName: 'hector', lastName: 'zarco', country: 'spain'});
    db.push('user', {id: 2, firstName: 'joan', lastName: 'romano', country: 'spain'});
    db.push('user', {id: 3, firstName: 'alex', lastName: 'manzella', country: 'italy'});
    const users = db.filter('user', u => u.country === 'spain');

    assert.ok(users.length === 2, 'Return the expected records');
    assert.ok(users[0].id === 1, 'The fist record is correct');
    assert.ok(users[1].id === 2, 'The second record is correct');
    assert.end();
  });

  test('DB#push', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.push('user', userFactory());
    db.push('user', [userFactory(), userFactory()]);
    db.push('user', {id: 2, customAttr: 'customValue'});

    assert.ok(db.store.user.length === 4, 'Pushes the records to the store');
    assert.ok(db.store.user[0].id === undefined, 'Doesnt add the incremental id for pushed records');
    assert.ok(db.store.user[2].lastName === 'zarco', 'The last user lastName is correct');
    assert.ok(db.find('user', 2).customAttr === 'customValue', 'Is able to find the the custom record by id');
    assert.end();
  });

  test('DB#all', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.create('user', 10);

    assert.ok(db.all('user').length === 10, 'Return all the users on the database');

    db.create('user', 2);

    assert.ok(db.all('user').length === 12, 'Return the expected number of users after adding new ones');
    assert.end();
  });

  test('DB#reset', assert => {
    const db = new DB();
    db.register('user', userFactory);
    db.create('user', 2);

    assert.ok(db.store.user.length === 2, 'The state is set up properly');
    assert.ok(db.factoryFor('user'), 'Is able to return the user factory');

    db.reset();

    assert.ok(!db.store.user, 'The state clean up');
    assert.ok(!db.factoryFor('user'), 'No factories are present');

    assert.end();
  });
};
