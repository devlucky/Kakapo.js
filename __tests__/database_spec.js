//@flow
import Faker from "faker";

import {
  Database,
  CollectionNotFoundError,
  type CollectionSchema,
  type DataFactory,
  type DataSerializer
} from "../src/Database";
import {
  type User,
  type SerializedUser,
  type UserId,
  type UserCollectionSchema,
  userFactory,
  userSerializer,
  someUser
} from "./data/users";

describe("Database", () => {
  type Book = {
    +userId: UserId,
    +name: string
  };

  type Schema = {
    +user: UserCollectionSchema,
    +book: CollectionSchema<Book>
  };

  type SetupOptions = {
    +factory?: DataFactory<User>,
    +users?: User[]
  };

  const setup = ({
    factory = jest.fn(userFactory),
    users = []
  }: SetupOptions = {}) => {
    const database: Database<Schema> = new Database();
    const serializer = jest.fn(userSerializer);

    database.register("user", factory, serializer);
    users.forEach(user => database.push("user", user));

    return {
      database,
      factory,
      serializer
    };
  };

  describe("create", () => {
    it("should create a record given no size specified", () => {
      const { database } = setup({ factory: () => someUser });
      const records = database.create("user");

      expect(records).toHaveLength(1);

      const [record] = records;
      expect(record.id).toEqual(0);
      expect(record.save).toEqual(expect.any(Function));
      expect(record.delete).toEqual(expect.any(Function));
      expect(record.data).toEqual({
        id: someUser.id,
        fullName: `${someUser.firstName} ${someUser.lastName}`,
        age: someUser.age
      });
    });

    it("should create multiple records given size is over 1", () => {
      const { database } = setup();
      const records = database.create("user", 10);

      expect(records).toHaveLength(10);
    });

    it("should return a record with original data given no serializer", () => {
      const database: Database<{
        user: CollectionSchema<User>
      }> = new Database();

      database.register("user", () => someUser);

      const [record] = database.create("user");

      expect(record.data).toEqual(someUser);
    });

    it("should throw error given collection has not been registered", () => {
      const database: Database<{
        user: CollectionSchema<User>
      }> = new Database();

      expect(() => database.create("user")).toThrow();
    });
  });

  describe("all", () => {
    it("should return all records given collection name", () => {
      const { database } = setup();

      database.create("user", 10);
      expect(database.all("user")).toHaveLength(10);

      database.create("user", 5);
      expect(database.all("user")).toHaveLength(15);
    });

    it("should return raw record given raw parameter set to true", () => {
      const { database } = setup({ factory: () => someUser });

      database.create("user", 1);

      const [record] = database.all("user", true);

      expect(record.data).toEqual(someUser);
    });

    it("should return serialized record given raw parameter set to false", () => {
      const { database } = setup({ factory: () => someUser });

      database.create("user", 1);

      const [record] = database.all("user", false);

      expect(record.data).toEqual({
        id: someUser.id,
        fullName: `${someUser.firstName} ${someUser.lastName}`,
        age: someUser.age
      });
    });
  });

  describe("find", () => {
    it("should return matching records given predicate", () => {
      const { database } = setup();

      database.create("user", 10);
      database.create("user", 5, () => userFactory({ firstName: "Jimmy" }));

      expect(database.all("user")).toHaveLength(15);
      expect(database.find("user", { firstName: "Jimmy" })).toHaveLength(5);
    });
  });
});

// describe('Database', () => {

//   test('DB # findOne', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 5);

//     db.register('comment', commentFactory);
//     db.create('comment', 10);

//     const name = db.all('user')[0].firstName;
//     const user1 = db.findOne('user', user => user.id === 2);
//     const user2 = db.findOne('user', { firstName: name });

//     const comment = db.findOne('comment', { author: { name: 'Morty' } });

//     expect(user1.id).toEqual(2);
//     expect(user2.firstName).toEqual(name)

//     expect(comment.author.name).toEqual('Morty');

//     // expect(() => db.findOne('user'),
//     //   'Doesn\'t throw error when collection is present.');
//     // expect(() => db.findOne('game'),
//     //   'Throws error when collection is not present.');
//   });

//   test('DB # first', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 5);

//     const user = db.first('user');

//     expect(isObject(user)).toBeTruthy();
//     expect(user.id).toEqual(0)

//     // expect(() => db.first('user'),
//     //   'Doesn\'t throw error when collection is present.');
//     // expect(() => db.first('game'),
//     //   'Throws error when collection is not present.');
//   });

//   test('DB # last', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 5);

//     const user = db.last('user');

//     expect(isObject(user)).toBeTruthy();
//     expect(user.id).toEqual(4);

//     // expect(() => db.last('user'),
//     //   'Doesn\'t throw error when collection is present.');
//     // expect(() => db.last('game'),
//     //   'Throws error when collection is not present.');
//   });

//   test('DB # push', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.push('user', { id: 1, name: 'Rick' });
//     db.push('user', { id: 2, name: 'Morty' });
//     db.push('user', { id: 3, name: 'ICE-T' });

//     const users = db.all('user');

//     expect(users).toHaveLength(3);
//     expect(users[0].name).toEqual('Rick');

//     // expect(() => db.push('user', {}),
//     //   'Doesn\'t throw error when collection is present.');
//     // expect(() => db.push('game', {}),
//     //   'Throws error when collection is not present.');
//   });

//   test('DB # record # save', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 20);

//     db.all('user').forEach((user, index) => {
//       user.firstName = (index % 2) ? 'Hector' : 'Oskar';
//       user.save();
//     });

//     expect(filter(db.all('user'), { firstName: 'Hector' })).toHaveLength(10);
//     expect(filter(db.all('user'), { firstName: 'Oskar' })).toHaveLength(10);
//   });

//   test('DB # register', () => {
//     const db = new Database();

//     db.register('user', userFactory);

//     // expect(() => db.checkFactoryPresence('user'),
//     //       'Registers factory properly.');
//   });

//   test('DB # reset', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 2);

//     db.reset();

//     // expect(() => db.all('user'),
//     //   'Cleans up all stores.');

//     // expect(() => db.checkFactoryPresence('user'),
//     //   'Cleans up all factories.');
//   });

//   test('DB # uuid', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.register('comment', commentFactory);

//     expect(db.uuid('user')).toEqual(0);
//     expect(db.uuid('user')).toEqual(1);
//     expect(db.uuid('comment')).toEqual(0);

//     // expect(() => db.uuid('user'),
//     //   'Doesn\'t throw error when collection is present.');
//     // expect(() => db.uuid('game'),
//     //   'Throws error when collection is not present.');
//   });

//   test('recordFactory # save', () => {
//     const db = new Database();

//     db.register('user', userFactory);
//     db.create('user', 2);

//     const user1 = db.all('user')[0];
//     const user2 = db.all('user')[1];

//     const oldFirstname1 = user1.firstName;
//     const oldFirstname2 = user2.firstName;

//     user1.firstName = 'NEW NAME';

//     const newUser1 = user1.save();
//     const newUser2 = user2.save();

//     // expect(db.all('user')[0].firstName).toEqual(oldFirstname1);
//     expect(db.all('user')[1].firstName).toEqual(oldFirstname2);

//     // expect(newUser1.firstName).toEqual(oldFirstname1);
//     expect(newUser2.firstName).toEqual(oldFirstname2);
//   });

//   test.skip('recordFactory # remove side effects', () => {
//     expect(4);

//     const server = new Server();
//     const router = new Router();
//     const database = new Database();

//     database.register('foo', _ => {
//       return {
//         foo: 'bar'
//       };
//     });
//     database.create('foo', 1);

//     router.get('/side_effects', (request, db) => {
//       return db.first('foo');
//     });

//     server.use(router);
//     server.use(database);

//     fetch('/side_effects').then(r => r.json()).then(response => {
//       expect(response.save).toBeUndefined();
//       expect(response.delete).toBeUndefined();
//     });

//     const xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = () => {
//       if (xhr.readyState !== 4) return;

//       const response = JSON.parse(xhr.responseText);

//       expect(response.save).toBeUndefined()
//       expect(response.delete).toBeUndefined()
//     };
//     xhr.open('GET', '/side_effects', true);
//     xhr.send();
//   });
// });
