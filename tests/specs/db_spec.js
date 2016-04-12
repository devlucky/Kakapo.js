import _ from 'lodash';
import test from 'tape';
import {DB} from '../../src/kakapo';

const userFactory = faker => ({
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  avatar: faker.internet.avatar
});

export const databaseSpec = () => {
  test('DB # constructor', assert => {
    const db = new DB();

    assert.ok(_.isObject(db.store), 'Sets up initial store object.');
    assert.ok(_.isObject(db.factories), 'Sets up initial factorie object.');
    assert.ok(_.isObject(db._uuids), 'Sets up initial identifier object.');

    assert.end();
  });

  test('DB # checkFactoryPresence', assert => {
    const db = new DB();

    db.register('user', userFactory);

    assert.doesNotThrow(() => db.checkFactoryPresence('user'),
      'Doesn\'t throw error when factory is present.');
    assert.throws(() => db.checkFactoryPresence('game'),
      'Throws error when factory is not present.');

    assert.end();
  });

  test('DB # decorateFactory', assert => {
    const db = new DB();

    db.register('user', userFactory);

    const user = db.decorateFactory('user', {name: 'Morty'});

    assert.ok(_.has(user, 'id'), 'Decorates record by adding id field to it.');

    assert.end();
  });

  test('DB # factoryFor', assert => {
    const db = new DB();

    db.register('user', userFactory);

    const factoryForExisting = db.factoryFor('user');
    const factoryForNotExisting = db.factoryFor('game');

    assert.ok(_.isFunction(factoryForExisting),
      'Returns callback if factory exists.');
    assert.ok(_.isUndefined(factoryForNotExisting),
      'Returns undefined if factory doesn\'t exist.');

    assert.end();
  });

  test('DB # register', assert => {
    const db = new DB();

    db.register('user', userFactory);

    assert.ok(_.isFunction(db.factories.user), 'Registers factory properly');

    assert.end();
  });

  test('DB # create', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.create('user', 5);

    assert.equal(db.store.user.length, 5, 'Creates users in empty store.');

    db.create('user', 2);

    assert.equal(db.store.user.length, 7, 'Creates users in non-empty store');

    assert.end();
  });

  test('DB # find', assert => {
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

  test('DB # filter', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.create('user', 5);

    const users1 = db.filter('user', user => user.id > 2);
    const users2 = db.filter('user', {id: 2});

    assert.equal(users1.length, 2, 'Filters users with function as condition.');
    assert.equal(users2.length, 1, 'Filters users with object as condition.');

    assert.end();
  });

  test('DB # push', assert => {
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

  test('DB # all', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.create('user', 10);

    const users = db.all('user');

    assert.equal(users.length, 10, 'Returns all users from store.');
    assert.ok(_.isArray(users), 'Returns all users from store as array.');

    assert.end();
  });

  test('DB # reset', assert => {
    const db = new DB();

    db.register('user', userFactory);
    db.create('user', 2);

    db.reset();

    assert.ok(_.isEmpty(db.store), 'Cleans up all stores.');
    assert.ok(_.isEmpty(db.factories), 'Cleans up all factories.');
    assert.ok(_.isEmpty(db._uuids), 'Cleans up all identifiers.');

    assert.end();
  });
};
