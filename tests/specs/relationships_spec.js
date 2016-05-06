import test from 'tape';
import { Database } from '../../src/kakapo';

export const relationshipsSpec = () => {
  test('Relationships # belongsTo', assert => {
    const db = new Database();
    const userFactory = () => ({
      firstName: 'hector',
      avatar: db.belongsTo('avatar'),
      city: db.belongsTo('city', {name: 'Valencia'})
    });
    const avatarFactory = (faker) => ({
      url: faker.internet.avatar,
      type: 'avatar'
    });
    const cityFactory = () => ({
      name: 'Valencia',
      country: 'Spain'
    });

    db.register('user', userFactory);
    db.register('avatar', avatarFactory);
    db.register('city', cityFactory);

    db.create('city', 1);
    db.create('avatar', 5);
    db.create('user', 2);

    const user = db.find('user', {id: 1});

    assert.equal(user.avatar.type, 'avatar', 'Finds the type of the relationship');
    assert.equal(typeof user.avatar.url, 'string', 'Finds the url of the relationship');
    assert.equal(user.city.name, 'Valencia', 'The city relationship has the expected name');
    assert.equal(user.city.country, 'Spain', 'The city relationship has the expected country');
    assert.end();
  });

  test('Relationships # hasMany', assert => {
    const db = new Database();
    const blogFactory = () => ({
      posts: db.hasMany('post'),
      authors: db.hasMany('user', 2)
    });
    const postFactory = () => ({
      title: 'Js for the lulz',
      body: 'html body'
    });
    const userFactory = () => ({
      name: 'devlucky',
      followers: 1000
    });

    db.register('blog', blogFactory);
    db.register('post', postFactory);
    db.register('user', userFactory);

    db.create('post', 10);
    db.create('user', 5);
    db.create('blog', 1);

    const blog = db.first('blog');

    assert.equal(blog.posts[0].title, 'Js for the lulz', 'First record title is the expected one');
    assert.equal(blog.authors[0].name, 'devlucky', 'First record title is the expected one');
    assert.equal(blog.authors.length, 2, 'Records lenght of a hasMany is the expected one when passing the limit argument');
    assert.end();
  });
};
