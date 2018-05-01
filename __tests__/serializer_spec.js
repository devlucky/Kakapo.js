import { Database } from '../src';
import { JSONApiSerializer } from '../src/serializers';

describe.skip('Serializer', () => {
  test('Serializer # JSONApi', (assert) => {
    const db = new Database();

    db.register('user', () => ({
      firstName: 'Hector',
      lastName: 'Zarco',
      age: 24,
    }), JSONApiSerializer);

    db.register('comment', () => ({
      text: 'comment text',
      date: '01.01.2016',
    }));

    db.create('user', 2);
    db.create('comment', 1);

    const user = db.findOne('user', { id: 0 });
    const users = db.find('user', { firstName: 'Hector' });
    const comment = db.findOne('comment', { id: 0 });
    const allUsers = db.all('user');

    assert.equal(comment.text, 'comment text',
      'Finds a record without serializer');
    assert.equal(user.data.attributes.firstName, 'Hector',
      'Finds JSONApi attributes');
    assert.equal(user.data.id, 0, 'Find JSONApi attributes');
    assert.equal(users[1].data.attributes.lastName, 'Zarco', 'Find JSONApi id');
    assert.equal(users[1].data.id, 1, 'Find JSONApi id');
    assert.equal(allUsers[0].data.id, 0,
      'Serializer works fine with `all` method');

    assert.end();
  });
});
