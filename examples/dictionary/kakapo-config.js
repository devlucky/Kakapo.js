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

    return payload;
  };
  db.register('word', faker => {
    return {
      author: "Anon",
      current_vote: "",
      defid: 118275,
      definition: "",
      example: "",
      permalink: "http://car.urbanup.com/118275",
      thumbs_down: 474,
      thumbs_up: 1546,
      word: "car"
    }
  });
  db.register('tag', faker => {
    return {
      value: faker.random.word
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
  }, termSerializer);

  db.push('word', {
    word: 'car',
    definition: 'Men best companion. Often referred as "My wife".',
    example: 'Dude! Wheres my car?'
  });
  db.push('word', {
    word: 'car',
    definition: 'something that goes, vrooooooom vroooooooooom=]',
    example: 'that [car] was going 120 miles per hour vroom bitchh vrooom'
  });
  db.push('word', {
    word: 'car',
    definition: 'A place where you can have sex.',
    example: "Thats the 10th girl I've slammed in my car!"
  });
  db.push('word', {
    word: 'drive',
    definition: 'when you talk about a person or something they have on',
    example: "Everybody is going to drive you if you come to school with your hair not combed."
  });
  db.push('word', {
    word: 'drive',
    definition: 'to use, make use of, apply',
    example: "Drive a computer, drive silverware, drive a a swimsuit"
  });
  db.push('word', {
    word: 'fast',
    definition: '1. state of speed used to keep one out of jail',
    example: "Joe was fast, and outran the cop."
  });
  db.push('word', {
    word: 'traffic',
    definition: 'A busy place with large amounts of people, (used in place of "busy", and in this sense not referring to vehicle congestion )',
    example: "Man mcd's was so traffic today, i was boxed in and had to wait 20min in the drive through! yeah we did go to see the movie last night, but the theatre was so traffic we left and got coffee instead."
  });
  db.push('word', {
    word: 'traffic',
    definition: 'Traffic was a rock band formed in the 1960s which featured Steve Winwood on vocals.',
    example: '"The Low Spark of High Heeled Boys" is one of Traffic best songs.'
  });
  db.push('word', {
    word: 'truck',
    definition: 'They are the device that attaches the wheels to the [skateboard].',
    example: "When he [grinds], his trucks throw sparks!"
  });
  db.push('tag', {value: 'drive'});
  db.push('tag', {value: 'fast'});
  db.push('tag', {value: 'traffic'});
  db.push('tag', {value: 'truck'});
  db.push('tag', {value: 'vehicle'});
  db.create('term', 10);

  //TODO: Use 'db' from params
  router.get('/define', (request) => {
    //TODO: Serialize 'tags' properly
    const term = request.query.term;
    const record = db.findOne('term', {name: term});
    debugger
    console.log(record);
    return record;
  });

  // server.use(db);
  // server.use(router);
})();