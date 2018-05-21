//@flow
import Faker from "faker";

import {
  Database,
  CollectionNotFoundError,
  type DataFactory
} from "../src/Database";
import { type User, type UserId, userFactory, someUser } from "./data/users";

describe("Database", () => {
  type Book = {
    +userId: UserId,
    +name: string
  };

  type Schema = {
    +user: User,
    +book: Book
  };

  type SetupOptions = {
    +factory?: DataFactory<User>
  };

  const firstName = Faker.name.firstName();
  const lastName = Faker.name.lastName();

  const setup = ({ factory = jest.fn(userFactory) }: SetupOptions = {}) => {
    const database: Database<Schema> = new Database();

    database.register("user", factory);

    return {
      database,
      factory
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
      expect(record.data).toEqual(someUser);
    });

    it("should create multiple records given size is over 1", () => {
      const { database } = setup();
      const records = database.create("user", 10);

      expect(records).toHaveLength(10);
    });

    it("should throw error given collection has not been registered", () => {
      const database: Database<{
        user: User
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
  });

  describe("find", () => {
    it("should return matching records given predicate", () => {
      const { database } = setup();

      database.create("user", 10);
      database.create("user", 5, () => userFactory({ firstName }));

      expect(database.all("user")).toHaveLength(15);
      expect(database.find("user", { firstName })).toHaveLength(5);
    });
  });

  describe("findOne", () => {
    it("should return first matching record given predicate", () => {
      const { database } = setup();
      const user = userFactory({ firstName, lastName });

      database.create("user", 10);
      database.push("user", user);
      database.create("user", 5, () => userFactory({ firstName }));
      database.create("user", 10);

      expect(database.findOne("user", { firstName }).data).toEqual(user);
    });
  });

  describe("first", () => {
    it("should return the first record given collection name", () => {
      const { database } = setup();

      database.push("user", someUser);
      database.create("user", 10);

      expect(database.first("user").data).toEqual(someUser);
    });
  });

  describe("last", () => {
    it("should return the last record given collection name", () => {
      const { database } = setup();

      database.create("user", 10);
      database.push("user", someUser);

      expect(database.last("user").data).toEqual(someUser);
    });
  });

  describe("push", () => {
    it("should return a record given some data", () => {
      const { database } = setup();

      const record = database.push("user", someUser);

      expect(record.data).toEqual(someUser);
    });
  });

  describe("register", () => {
    it("should allow database to create records of given collection name", () => {
      const { database } = setup();

      database.register("book", () => ({
        id: Faker.random.uuid(),
        name: Faker.hacker.phrase(),
        userId: someUser.id
      }));

      const records = database.create("book", 10);

      expect(records).toHaveLength(10);
    });

    it("should now allow database to create records of given collection has not been registered", () => {
      const { database } = setup();

      expect(() => database.create("book")).toThrow();
    });
  });

  describe("reset", () => {
    it("should remove all collections", () => {
      const { database } = setup();

      expect(database.exists("user")).toBeTruthy();
      expect(database.exists("book")).toBeFalsy();

      database.register("book", () => ({
        id: Faker.random.uuid(),
        name: Faker.hacker.phrase(),
        userId: someUser.id
      }));

      expect(database.exists("user")).toBeTruthy();
      expect(database.exists("book")).toBeTruthy();

      database.reset();

      expect(database.exists("user")).toBeFalsy();
      expect(database.exists("book")).toBeFalsy();
    });
  });

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
});

describe("Record", () => {
  describe("save", () => {
    it("should do something", () => {
      //     const db = new Database();
      //     db.register('user', userFactory);
      //     db.create('user', 20);
      //     db.all('user').forEach((user, index) => {
      //       user.firstName = (index % 2) ? 'Hector' : 'Oskar';
      //       user.save();
      //     });
      //     expect(filter(db.all('user'), { firstName: 'Hector' })).toHaveLength(10);
      //     expect(filter(db.all('user'), { firstName: 'Oskar' })).toHaveLength(10);
    });
  });
});
