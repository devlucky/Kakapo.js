import { Database } from '../src';

describe('Relationships', () => {
  test('Relationships # belongsTo', () => {
    const db = new Database();
    const userFactory = () => ({
      firstName: 'hector',
      avatar: db.belongsTo('avatar'),
      city: db.belongsTo('city', { name: 'Valencia' }),
    });
    const avatarFactory = (faker) => ({
      url: faker.internet.avatar,
      type: 'avatar',
    });
    const cityFactory = () => ({
      name: 'Valencia',
      country: 'Spain',
    });
  
    db.register('user', userFactory);
    db.register('avatar', avatarFactory);
    db.register('city', cityFactory);
  
    db.create('city', 1);
    db.create('avatar', 5);
    db.create('user', 2);
  
    const user = db.findOne('user', { id: 1 });
  
    expect(user.avatar.type).toEqual('avatar');
    expect(typeof user.avatar.url).toEqual('string');
    expect(user.city[0].name).toEqual('Valencia');
    expect(user.city[0].country).toEqual('Spain');
  });
  
  test('Relationships # hasMany', () => {
    const db = new Database();
    const blogFactory = () => ({
      posts: db.hasMany('post'),
      authors: db.hasMany('user', 2),
    });
    const postFactory = () => ({
      title: 'Js for the lulz',
      body: 'html body',
    });
    const userFactory = () => ({
      name: 'devlucky',
      followers: 1000,
    });
  
    db.register('blog', blogFactory);
    db.register('post', postFactory);
    db.register('user', userFactory);
  
    db.create('post', 10);
    db.create('user', 5);
    db.create('blog', 1);
  
    const blog = db.first('blog');
  
    expect(blog.posts[0].title).toEqual('Js for the lulz');
    expect(blog.authors[0].name).toEqual('devlucky');
    expect(blog.authors).toHaveLength(2);
  });
})
