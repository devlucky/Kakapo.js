import { Database } from '../src';
import { JSONApiSerializer } from '../src/serializers';

describe('Serializer', () => {
  test('Serializer # JSONApi', () => {
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

    expect(comment.text).toEqual('comment text');
    expect(user.data.attributes.firstName).toEqual('Hector')
    expect(user.data.id).toEqual(0);
    expect(users[1].data.attributes.lastName).toEqual('Zarco');
    expect(users[1].data.id).toEqual(1);
    expect(allUsers[0].data.id).toEqual(0);
  });
});
