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

  router.put('/todos/:todo_id', (request) => {
    const updatedTodo = JSON.parse(request.body);
    const id = parseInt(request.params.todo_id);
    const todo = db.findOne('todo', {id});

    Object.keys(updatedTodo).forEach(k => {
      todo[k] = updatedTodo[k];
    });

    todo.save();
    
    return todo;
  });

  router.delete('/todos/:todo_id', (request) => {
    const id = request.params.todo_id;

  });
})();