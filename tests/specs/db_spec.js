import tapeTest from 'tape';
import {DB} from '../../src/kakapo';

const userFactory = faker => ({
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  avatar: faker.internet.avatar
});

const commentFactory = () => {
  return {
    text: () => 'foo',
    likes: () => 3
  };
};

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

    const name = db.store.user[0].firstName;
    const user1 = db.find('user', user => user.id === 2);
    const user2 = db.find('user', {firstName: name});

    assert.equal(user1.id, 2, 'Finds user with function as condition.');
    assert.equal(user2.firstName, name, 'Finds user with object as condition.');

    assert.end();
  });

  test('DB#filter', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.create('user', 5);

    const users1 = db.filter('user', user => user.id > 2);
    const users2 = db.filter('user', {id: 2});

    assert.equal(users1.length, 2, 'Filters users with function as condition.');
    assert.equal(users2.length, 1, 'Filters users with object as condition.');

    assert.end();
  });

  test('DB#push', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.push('user', {id: 1, name: 'Rick'});
    db.push('user', {id: 2, name: 'Morty'});
    db.push('user', {id: 3, name: 'ICE-T'});

    const users = db.store.user;

    assert.equal(users.length, 3, 'Pushes all records to store.');
    assert.equal(users[0].name, 'Rick', 'Pushes all records in valid order.');

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
