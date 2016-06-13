import _ from 'lodash';
import test from 'tape';
import { Server, Router, Database } from '../../src';

const userFactory = faker => ({
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  address: {
    streetName: faker.address.streetName,
  },
  avatar: faker.internet.avatar,
});

const commentFactory = faker => ({
  title: 'He-yo',
  content: faker.lorem.paragraph,
  author: { name: 'Morty' },
});

export const databaseSpec = () => {
  test('DB # all', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 10);

    const users = db.all('user');

    assert.equal(users.length, 10, 'Returns all users from store.');
    assert.ok(_.isArray(users), 'Returns all users from store as array.');

    assert.doesNotThrow(() => db.all('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.all('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # checkFactoryPresence', (assert) => {
    const db = new Database();

    db.register('user', userFactory);

    assert.doesNotThrow(() => db.checkFactoryPresence('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.checkFactoryPresence('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # create', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 5);

    assert.equal(db.all('user').length, 5, 'Creates users in empty store.');

    db.create('user', 2);

    assert.equal(db.all('user').length, 7, 'Creates users in non-empty store');

    assert.end();
  });

  test('DB # create # fake values', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.register('comment', commentFactory);

    db.create('user', 5);
    db.create('comment', 10);

    const users = db.all('user');
    const comments = db.all('comment');

    assert.ok(_.every(users, user => _.isString(user.firstName)),
      'Assigns valid, generated data for entities.');
    assert.ok(_.every(users, user => _.isString(user.address.streetName)),
      'Assigns valid, generated data for nested entities.');
    assert.ok(_.every(comments, comment => _.isString(comment.title)),
      'Assigns valid, static data for entities.');
    assert.ok(_.every(comments, comment => _.isString(comment.author.name)),
      'Assigns valid, static data for nested entities.');

    assert.end();
  });

  test('DB # decorateRecord', (assert) => {
    const db = new Database();

    db.register('user', userFactory);

    const user = db.decorateRecord('user', { name: 'Morty' });

    assert.ok(_.has(user, 'id'), 'Decorates record by adding id field to it.');

    assert.doesNotThrow(() => db.decorateRecord('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.decorateRecord('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # find', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 5);

    db.register('comment', commentFactory);
    db.create('comment', 10);

    const users1 = db.find('user', user => user.id > 2);
    const users2 = db.find('user', { id: 2 });
    const comments = db.find('comment', { author: { name: 'Morty' } });

    assert.equal(users1.length, 2, 'Finds users with function as condition.');
    assert.equal(users2.length, 1, 'Finds users with object as condition.');
    assert.equal(comments.length, 10, 'Finds with nested conditions.');

    assert.doesNotThrow(() => db.find('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.find('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # findOne', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 5);

    db.register('comment', commentFactory);
    db.create('comment', 10);

    const name = db.all('user')[0].firstName;
    const user1 = db.findOne('user', user => user.id === 2);
    const user2 = db.findOne('user', { firstName: name });

    const comment = db.findOne('comment', { author: { name: 'Morty' } });

    assert.equal(user1.id, 2, 'Finds user with function as condition.');
    assert.equal(user2.firstName, name, 'Finds user with object as condition.');

    assert.equal(comment.author.name, 'Morty', 'Finds with nested conditions.');

    assert.doesNotThrow(() => db.findOne('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.findOne('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # first', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 5);

    const user = db.first('user');

    assert.ok(_.isObject(user), 'returns first entity of collection.');
    assert.equal(user.id, 0, 'returns correct first entity of collection.');

    assert.doesNotThrow(() => db.first('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.first('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # last', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 5);

    const user = db.last('user');

    assert.ok(_.isObject(user), 'returns last entity of collection.');
    assert.equal(user.id, 4, 'returns correct last entity of collection.');

    assert.doesNotThrow(() => db.last('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.last('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # push', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.push('user', { id: 1, name: 'Rick' });
    db.push('user', { id: 2, name: 'Morty' });
    db.push('user', { id: 3, name: 'ICE-T' });

    const users = db.all('user');

    assert.equal(users.length, 3, 'Pushes all records to store.');
    assert.equal(users[0].name, 'Rick', 'Pushes all records in valid order.');

    assert.doesNotThrow(() => db.push('user', {}),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.push('game', {}),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('DB # record # save', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 20);

    db.all('user').forEach((user, index) => {
      user.firstName = (index % 2) ? 'Hector' : 'Oskar';
      user.save();
    });

    assert.equal(_.filter(db.all('user'), { firstName: 'Hector' }).length, 10,
      'Properly saves changes on objects to store.');
    assert.equal(_.filter(db.all('user'), { firstName: 'Oskar' }).length, 10,
      'Properly saves changes on objects to store.');

    assert.end();
  });

  test('DB # register', (assert) => {
    const db = new Database();

    db.register('user', userFactory);

    assert.doesNotThrow(() => db.checkFactoryPresence('user'),
          'Registers factory properly.');

    assert.end();
  });

  test('DB # reset', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 2);

    db.reset();

    assert.throws(() => db.all('user'),
      'Cleans up all stores.');

    assert.throws(() => db.checkFactoryPresence('user'),
      'Cleans up all factories.');

    assert.end();
  });

  test('DB # uuid', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.register('comment', commentFactory);

    assert.equal(db.uuid('user'), 0, 'Returns 0 as first identifier.');
    assert.equal(db.uuid('user'), 1, 'Returns bigger identifier than before.');
    assert.equal(db.uuid('comment'), 0,
      'Returns different identifier for separate collections.');

    assert.doesNotThrow(() => db.uuid('user'),
      'Doesn\'t throw error when collection is present.');
    assert.throws(() => db.uuid('game'),
      'Throws error when collection is not present.');

    assert.end();
  });

  test('recordFactory # save', (assert) => {
    const db = new Database();

    db.register('user', userFactory);
    db.create('user', 2);

    const user1 = db.all('user')[0];
    const user2 = db.all('user')[1];

    const oldFirstname1 = user1.firstName;
    const oldFirstname2 = user2.firstName;

    user1.firstName = 'NEW NAME';

    const newUser1 = user1.save();
    const newUser2 = user2.save();

    assert.notEqual(db.all('user')[0].firstName, oldFirstname1,
      'Properly assigns new values to the record');
    assert.equal(db.all('user')[1].firstName, oldFirstname2,
      'Leaves field exactly the same when no changes made.');

    assert.notEqual(newUser1.firstName, oldFirstname1,
      'Returns changed record.');
    assert.equal(newUser2.firstName, oldFirstname2,
      'Returns the same record when no changes made.');

    assert.end();
  });

  test('recordFactory # remove side effects', (assert) => {
    assert.plan(4);

    const server = new Server();
    const router = new Router();
    const database = new Database();

    database.register('foo', _ => {
      return {
        foo: 'bar'
      };
    });
    database.create('foo', 1);

    router.get('/side_effects', (request, db) => {
      return db.first('foo');
    });

    server.use(router);
    server.use(database);

    fetch('/side_effects').then(r => r.json()).then(response => {
      assert.equal(response.save, undefined, 'Response doesnt contain save method for fetch api');
      assert.equal(response.delete, undefined, 'Response doesnt contain delete method for fetch api');
    });

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      const response = JSON.parse(xhr.responseText);
      
      assert.equal(response.save, undefined, 'Response doesnt contain save method for xhr');
      assert.equal(response.delete, undefined, 'Response doesnt contain delete method for xhr');      
    };
    xhr.open('GET', '/side_effects', true);
    xhr.send();
  });
};
