(function() {
  const host = 'https://api.github.com';
  const router = new Kakapo.Router({host});
  const db = new Kakapo.Database();
  const userSerializer = (user) => {
    return Object.assign({}, user, {
      name: "Tom Preston-Werner",
      company: null,
      blog: "http://tom.preston-werner.com",
      location: "San Francisco",
      email: "tom@mojombo.com",
      hireable: null,
      bio: null,
      public_repos: 60,
      public_gists: 65,
      followers: 19250,
      following: 11,
      created_at: "2007-10-20T05:24:19Z",
      updated_at: "2016-05-10T19:31:30Z"
    });
  };

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
      site_admin: true
    }
  });

  db.create('user', 30);

  router.get('/users', () => {
    return db.all('user');
  });

  router.get('/users/:login', (request) => {
    const login = request.params.login;
    
    return userSerializer(db.findOne('user', {login}));
  });
})();