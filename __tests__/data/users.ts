import * as Faker from 'faker';

export type UserId = string;

export type User = {
  id: UserId,
  firstName: string,
  lastName: string,
  age: number
};

export const userFactory = ({
  id = Faker.random.uuid(),
  firstName = Faker.name.firstName(),
  lastName = Faker.name.lastName(),
  age = Faker.random.number()
}: Partial<User> = {} as User) => ({
  id,
  firstName,
  lastName,
  age
});

export const someUser = userFactory();
