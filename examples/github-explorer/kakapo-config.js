(function() {
  const host = 'https://api.github.com';
  const router = new Kakapo.Router({host});
  const db = new Kakapo.Database();
  const stripedProperties = ['name', 'company', 'blog', 'location', 'email', 'hireable', 'bio', 'public_repos', 'public_gists', 'followers', 'following', 'created_at', 'updated_at'];

  db.register('user', (faker) => {
    const login = faker.internet.userName();

    return {
      login: login,
      avatar_url: faker.internet.avatar,
      gravatar_id: "",
      url: `https://api.github.com/users/${login}`,
      html_url: `https://github.com/${login}`,
      followers_url: `https://api.github.com/users/${login}/followers`,
      following_url: `https://api.github.com/users/${login}/following{/other_user}`,
      gists_url: `https://api.github.com/users/${login}/gists{/gist_id}`,
      starred_url: `https://api.github.com/users/${login}/starred{/owner}{/repo}`,
      subscriptions_url: `https://api.github.com/users/${login}/subscriptions`,
      organizations_url: `https://api.github.com/users/${login}/orgs`,
      repos_url: `https://api.github.com/users/${login}/repos`,
      events_url: `https://api.github.com/users/${login}/events{/privacy}`,
      received_events_url: `https://api.github.com/users/${login}/received_events`,
      type: "User",
      site_admin: true,
      // The following values are not displayed in '/users'
      name: faker.name.findName, 
      company: faker.company.companyName, 
      blog: faker.internet.url, 
      location: faker.address.city,
      email: faker.internet.email,
      hireable: null,
      bio: faker.hacker.phrase,
      public_repos: faker.random.number.bind(null, {min: 0, max: 150}),
      public_gists: faker.random.number.bind(null, {min: 0, max: 60}),
      followers: faker.random.number.bind(null, {min: 0, max: 300}),
      following: faker.random.number.bind(null, {min: 0, max: 100}),
      created_at: faker.date.past, 
      updated_at: faker.date.recent
    }
  });

  db.create('user', 30);

  router.get('/users', () => {
    //Stripe don't needed properties
    const users = db.all('user').map(u => {
      const user = Object.assign({}, u);
      stripedProperties.forEach(p => delete user[p]);

      return user;
    });

    return users;
  });

  router.get('/users/:login', (request) => {
    const login = request.params.login;
    
    return db.findOne('user', {login});
  });

  router.get('/search/users', (request) => {
    debugger
    return {}
  });
})();