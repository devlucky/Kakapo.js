import tapeTest from 'tape';
import {Database} from '../../src/database';
import {JSONApiSerializer} from '../../src/serializers';

function before() {
  
};

function test(title, cb) {
  tapeTest(title, (...args) => {
    before();
    cb(...args);
  });
}

export const serializerSpec = () => {
  test('Serializer # JSONApi', assert => {
    const db = new Database();

    db.register('user', (faker) => {
      return {
        firstName: 'Hector',
        lastName: 'Zarco',
        age: 24
      };
    }, JSONApiSerializer);
    db.create('user', 2);

    db.register('comment', (faker) => {
      return {
        text: 'comment text',
        date: '01.01.2016'
      };
    });
    db.create('comment', 1);

    const comment = db.find('comment', {id: 0});
    const user = db.find('user', {id: 0});
    const users = db.filter('user', {firstName: 'Hector'});
    const allUsers = db.all('user');

    assert.equal(comment.text, 'comment text', 'Finds a record without serializer');
    assert.equal(user.data.attributes.firstName, 'Hector', 'Find JSONApi attributes');
    assert.equal(user.data.id, 0, 'Find JSONApi attributes');
    assert.equal(users[1].data.attributes.lastName, 'Zarco', 'Find JSONApi id');
    assert.equal(users[1].data.id, 1, 'Find JSONApi id');
    assert.equal(allUsers[0].data.id, 0, 'Serializer works fine with "all" method');

    assert.end();
  });
}