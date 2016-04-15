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
    db.create('user', 1);

    db.register('comment', (faker) => {
      return {
        firstName: faker.name.firstName,
        lastName: 'Zarco',
        age: 24
      };
    });
    db.create('comment', 1);

    const comment = db.find('comment', {id: 0});

    // debugger

    assert.end();
  });
}