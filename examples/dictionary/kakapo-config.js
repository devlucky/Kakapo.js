//TODO: Use relationships --> word.tag hasMany TAG
//TODO: requestDelay
//TODO: Handle upvote request
//TODO: Handle downvote request
//TODO: Check request header (Mash-api-token)
(function() {
  const host = 'https://mashape-community-urban-dictionary.p.mashape.com';
  const server = new Kakapo.Server();
  const router = new Kakapo.Router({host});
  const db = new Kakapo.Database();
  const termSerializer = (record) => {
    const tags = record.tags.map(r => r.value);
    const payload = Object.assign({}, record, {tags});
    debugger
    return payload;
  };
  db.register('word', faker => {
    return {
      author: "Anon",
      current_vote: "",
      defid: 118275,
      definition: "Mens best companion. Often referred as Mywife",
      example: "Dude! Wheres my car?",
      permalink: "http://car.urbanup.com/118275",
      thumbs_down: 474,
      thumbs_up: 1546,
      word: "car"
    }
  });
  db.register('tag', faker => {
    return {
      value: 'foo' //TODO: Use unique values
    };
  });
  db.register('term', (faker) => {

    return {
      name: faker.random.arrayElement.bind(null, ['a','b','c']),
      list: db.hasMany('word'),
      result_type: 'exact',
      sounds: [],
      tags: db.hasMany('tag')
    };
  }); //, termSerializer

  db.create('word', 10);
  db.create('tag', 10);
  db.create('term', 10);

  //TODO: Use 'db' from params
  // router.get('/define', (request) => {
  //   //TODO: Serialize 'tags' properly
  //   const term = 'c' || request.query.term;
  //   const record = db.findOne('term', {name: term});

  //   console.log(record);
  //   return record;
  // });

  router.get('/define', _ => {
    return {
      foo: 'bar'
    };
  });

  // server.use(db);
  // server.use(router);
})();