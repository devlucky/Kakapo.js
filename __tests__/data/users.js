// @flow
import Faker from "faker";
import {
  type CollectionSchema,
  type DataFactory,
  type DataSerializer
} from "../../src/Database";

export opaque type UserId = string;

export type User = {
  +id: UserId,
  +firstName: string,
  +lastName: string,
  +age: number
};

export type SerializedUser = {
  +id: UserId,
  +fullName: string,
  +age: number
};

export type UserCollectionSchema = CollectionSchema<User, SerializedUser>;

export const userFactory = ({
  id = Faker.random.uuid(),
  firstName = Faker.name.firstName(),
  lastName = Faker.name.lastName(),
  age = Faker.random.number()
}: { ...User } = {}) => ({
  id,
  firstName,
  lastName,
  age
});

export const userSerializer: DataSerializer<User, SerializedUser> = ({
  id,
  firstName,
  lastName,
  age
}) => ({
  id,
  fullName: `${firstName} ${lastName}`,
  age
});

export const someUser = userFactory();
