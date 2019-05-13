import * as Faker from 'faker';

import { Database, DataFactory } from '../src/Database';
import { User, UserId, userFactory, someUser } from './data/users';

describe('Database', () => {
    type Book = {
        userId: UserId;
        name: string;
    };

    type Schema = {
        user: User;
        book: Book;
    };

    type SetupOptions = {
        factory?: DataFactory<User>;
    };

    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();

    const setup = ({ factory = jest.fn(userFactory) }: SetupOptions = {}) => {
        const database: Database<Schema> = new Database();

        database.register('user', factory);

        return {
            database,
            factory
        };
    };

    describe('create', () => {
        it('should create a record given no size specified', () => {
            const { database } = setup({ factory: () => someUser });
            const records = database.create('user');

            expect(records).toHaveLength(1);

            const [record] = records;
            expect(record.id).toEqual(0);
            expect(record.data).toEqual(someUser);
        });

        it('should create multiple records given size is over 1', () => {
            const { database } = setup();
            const records = database.create('user', 10);

            expect(records).toHaveLength(10);
        });

        it('should throw error given collection has not been registered', () => {
            const database: Database<{
            user: User;
            }> = new Database();

            expect(() => database.create('user')).toThrow();
        });
    });

    describe('all', () => {
        it('should return all records given collection name', () => {
            const { database } = setup();

            database.create('user', 10);
            expect(database.all('user')).toHaveLength(10);

            database.create('user', 5);
            expect(database.all('user')).toHaveLength(15);
        });
    });

    describe('delete', () => {
        it('should return a record given id of existing record', () => {
            const { database } = setup();
            const user = userFactory({ firstName, lastName });

            database.create('user', 10);
            const record = database.push('user', user);

            expect(database.all('user')).toHaveLength(11);
            expect(database.delete('user', record.id)).toEqual(record);
            expect(database.all('user')).toHaveLength(10);
        });

        it('should return null given id of non-existing record', () => {
            const { database } = setup();
            const user = userFactory({ firstName, lastName });

            database.create('user', 10);

            expect(database.all('user')).toHaveLength(10);
            expect(database.delete('user', 123)).toBeNull();
            expect(database.all('user')).toHaveLength(10);
        });
    });

    describe('find', () => {
        it('should return matching records given predicate', () => {
            const { database } = setup();

            database.create('user', 10);
            database.create('user', 5, () => userFactory({ firstName }));

            expect(database.all('user')).toHaveLength(15);
            expect(database.find('user', { firstName })).toHaveLength(5);
        });
    });

    describe('findOne', () => {
        it('should return first matching record given predicate', () => {
            const { database } = setup();
            const user = userFactory({ firstName, lastName });

            database.create('user', 10);
            database.push('user', user);
            database.create('user', 5, () => userFactory({ firstName }));
            database.create('user', 10);

            expect(database.findOne('user', { firstName })!.data).toEqual(user);
        });
    });

    describe('first', () => {
        it('should return the first record given collection name', () => {
            const { database } = setup();

            database.push('user', someUser);
            database.create('user', 10);

            expect(database.first('user')!.data).toEqual(someUser);
        });
    });

    describe('last', () => {
        it('should return the last record given collection name', () => {
            const { database } = setup();

            database.create('user', 10);
            database.push('user', someUser);

            expect(database.last('user')!.data).toEqual(someUser);
        });
    });

    describe('push', () => {
        it('should return a record given some data', () => {
            const { database } = setup();

            const record = database.push('user', someUser);

            expect(record.data).toEqual(someUser);
        });
    });

    describe('register', () => {
        it('should allow database to create records of given collection name', () => {
            const { database } = setup();

            database.register('book', () => ({
                id: Faker.random.uuid(),
                name: Faker.hacker.phrase(),
                userId: someUser.id
            }));

            const records = database.create('book', 10);

            expect(records).toHaveLength(10);
        });

        it('should now allow database to create records of given collection has not been registered', () => {
            const { database } = setup();

            expect(() => database.create('book')).toThrow();
        });
    });

    describe('reset', () => {
        it('should remove all collections', () => {
            const { database } = setup();

            expect(database.exists('user')).toBeTruthy();
            expect(database.exists('book')).toBeFalsy();

            database.register('book', () => ({
                id: Faker.random.uuid(),
                name: Faker.hacker.phrase(),
                userId: someUser.id
            }));

            expect(database.exists('user')).toBeTruthy();
            expect(database.exists('book')).toBeTruthy();

            database.reset();

            expect(database.exists('user')).toBeFalsy();
            expect(database.exists('book')).toBeFalsy();
        });
    });

    describe('update', () => {
        it('should return an updated record given id of existing record', () => {
            const { database } = setup();
            const [record] = database.create('user');

            const updatedRecord = database.update('user', record.id, {
                firstName: 'Jimmy'
            });

            expect(updatedRecord.id).toEqual(record.id);
            expect(updatedRecord.data).toEqual({
                ...record.data,
                firstName: 'Jimmy'
            });
        });

        it('should throw an error given id of non-existing record', () => {
            const { database } = setup();

            database.create('user', 10);

            expect(() =>
                database.update('user', 123, { firstName: 'Jimmy' })
            ).toThrow();
        });
    });
});
