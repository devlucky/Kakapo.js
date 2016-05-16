(() => {
  let todos = [];
  const select = (selector) => document.querySelector(selector);
  const hasClass = (el, name) => el.classList.contains(name);

  const fetchRequest = (url, options) => {
    const request = new Request(url);
    return fetch(request, options).then(r => r.json());
  };

  const loadTodos = () => fetch('/todos')
    .then(r => r.json())
    .then(response => { todos = response; });

  const todoTemplate = (todo, editing) => {
    const classNames = todo.done ? 'completed' : (editing ? 'editing' : '');
    const checked = todo.done ? 'checked' : '';

    return `
    <li class="${classNames}" data-todo-id="${todo.id}">
      <div class="view">
        <input class="toggle" type="checkbox" ${checked}>
        <label class="label">${todo.title}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="${todo.title}">
    </li>
    `;
  };

  const createTodo = (title) => {
    const todo = {
      title,
      done: false,
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(todo),
    };

    return fetchRequest('/todos', options)
      .then(t => todos.push(t));
  };

  const updateTodo = (todo) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(todo),
    };

    return fetchRequest(`/todos/${todo.id}`, options)
      .then(() => {});
  };

  const destroyTodo = (todoId) => {
    const options = {
      method: 'DELETE',
    };

    return fetchRequest(`/todos/${todoId}`, options)
      .then(response => { todos = response; });
  };

  const render = () => {
    const len = todos.length;
    let todosLeft = 0;
    const todosHtml = todos.map(t => {
      if (!t.done) todosLeft++;

      return todoTemplate(t);
    }).join('');

    select('.todo-list').innerHTML = todosHtml;
    select('.todo-count strong').innerText = todosLeft;
    select('.footer').hidden = !len;
    select('.clear-completed').hidden = len === todosLeft;
  };

  function onClearCompleted() {
    const completed = todos.filter(t => t.done);
    const promises = completed.map(t => destroyTodo(t.id));

    Promise.all(promises).then(render);
  }

  const onToggleAll = () => {
    const newStatus = todos.find(t => !t.done);

    const promises = todos.map(t => {
      if (t.done === newStatus) { return; }
      t.done = newStatus;

      return updateTodo(t);
    });

    Promise.all(promises).then(render);
  };

  const onFinishEditing = (event) => {
    const code = event.keyCode;
    const target = event.target;

    if (code !== 13 || !hasClass(target, 'edit')) { return; }

    const title = target.value;
    if (!title) { return destroyTodo(); }

    const todoId = target.parentElement.getAttribute('data-todo-id');
    const todo = todos.find(t => t.id === parseInt(todoId, 10));

    todo.title = title;

    updateTodo(todo).then(render);
  };

  const onDblClick = (event) => {
    const target = event.target;
    if (!hasClass(target, 'label')) { return; }

    const parent = target.parentElement.parentElement;
    parent.classList.add('editing');
  };

  function onCreateTodo(event) {
    const code = event.keyCode;
    const title = this.value.trim();

    if (code !== 13 || !title) return;

    this.value = '';
    createTodo(title).then(render);
  }

  const onTodoClick = (event) => {
    const target = event.target;
    const todoId = target.parentElement.parentElement.getAttribute('data-todo-id');

    if (hasClass(target, 'toggle')) {
      const todo = todos.find(t => t.id === parseInt(todoId, 10));
      todo.done = !todo.done;
      updateTodo(todo).then(render);
    }

    if (hasClass(target, 'destroy')) {
      destroyTodo(todoId).then(render);
    }
  };

  const addEvents = () => {
    select('.todo-list').addEventListener('click', onTodoClick);
    select('.todo-list').addEventListener('dblclick', onDblClick);
    select('.todo-list').addEventListener('keyup', onFinishEditing);
    select('.toggle-all').addEventListener('click', onToggleAll);
    select('.new-todo').addEventListener('keyup', onCreateTodo);
    select('.clear-completed').addEventListener('click', onClearCompleted);
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadTodos().then(render);
    addEvents();
  });
})();
