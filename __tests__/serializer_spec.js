// @flow
import Faker from "faker";

import { Database } from "../src";
import { JSONApiSerializer } from "../src/serializers";

describe("Serializer", () => {
  test("Serializer # JSONApi", () => {
    const db = new Database();
    let userId = 0;

    db.register(
      "user",
      () => ({
        id: userId++,
        firstName: "Hector",
        lastName: "Zarco",
        age: 24
      }),
      JSONApiSerializer
    );

    db.register("comment", () => ({
      text: "comment text",
      date: "01.01.2016"
    }));

    db.create("user", 2);
    db.create("comment", 1);

    const user = db.first("user");
    const users = db.find("user", { firstName: "Hector" });
    const comment = db.first("comment");
    const allUsers = db.all("user");

    expect(comment.data.text).toEqual("comment text");
    expect(user.data.data.attributes.firstName).toEqual("Hector");
    expect(user.data.data.id).toEqual(0);
    expect(users[1].data.data.attributes.lastName).toEqual("Zarco");
    expect(users[1].data.data.id).toEqual(1);
    expect(allUsers[0].data.data.id).toEqual(0);
  });
});
