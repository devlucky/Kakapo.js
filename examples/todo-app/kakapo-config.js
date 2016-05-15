(function() {
  'use strict';
  let lastId = 1;
  const router = new Kakapo.Router();
  const db = new Kakapo.Database();
  const TODOS = [{
    id: lastId,
    title: 'Use Kakapo.js',
    done: false
  }];

  router.get('/todos', () => {
    return TODOS;
  });

  router.post('/todos', () => {
    debugger;
  });
})();