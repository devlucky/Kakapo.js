(function() {
  'use strict';
  const router = new Kakapo.Router();
  const db = new Kakapo.Database();

  db.register('todo', () => {
    return {
      title: 'Use Kakapo.js',
      done: false
    };
  });
    
  db.create('todo', 1);

  router.get('/todos', () => {
    return db.all('todo');
  });

  router.post('/todos', (request) => {
    const todo = JSON.parse(request.body);

    return db.push('todo', todo);
  });
})();