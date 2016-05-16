(function() {
  let todos = [];
  const $ = (selector) => {
    return document.querySelector(selector);
  };
  const request = (url, options) => {
    const request = new Request(url);

    return fetch(request, options).then(r => r.json());
  };
  const hasClass = (el, name) => el.classList.contains(name);

  const render = () => {
    const len = todos.length;
    let todosLeft = 0;
    const todosHtml = todos.map(t => {
      if (!t.done) todosLeft++;

      return todoTemplate(t);
    }).join('');

    $('.todo-list').innerHTML = todosHtml;
    $('.todo-count strong').innerText = todosLeft;
    $('.footer').hidden = !len;
    $('.clear-completed').hidden = len === todosLeft;
  };

  const loadTodos = () => {
    return fetch('/todos').then(r => r.json()).then(response => {
      todos = response;
    });
  }

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

  const addEvents = () => {
    $('.todo-list').addEventListener('click', onTodoClick);
    $('.todo-list').addEventListener('dblclick', onDblClick);
    $('.todo-list').addEventListener('keyup', onFinishEditing);
    $('.toggle-all').addEventListener('click', onToggleAll);
    $('.new-todo').addEventListener('keyup', onCreateTodo);
    $('.clear-completed').addEventListener('click', onClearCompleted);
  };

  function onToggleAll() {
    const allChecked = !todos.find(t => !t.done);
    const newStatus = allChecked ? false : true;
    const promises = todos.map(t => {
      if (t.done === newStatus) return;

      t.done = newStatus;

      return updateTodo(t);
    });

    Promise.all(promises).then(render);
  }

  function onFinishEditing(e) {
    const code = e.keyCode;
    const target = e.target;
                        
    if (code !== 13 || !hasClass(target, 'edit')) return;

    const title = target.value;

    if (!title) {
      return destroyTodo()
    }
    
    const todoId = target.parentElement.getAttribute('data-todo-id');
    const todo = todos.find(t => t.id == todoId);

    todo.title = title;

    updateTodo(todo).then(render);
  }

  function onDblClick(e) {
    const target = e.target;
    if (!hasClass(target, 'label')) return;

    const parent = target.parentElement.parentElement;

    parent.classList.add('editing');
  }

  function onClearCompleted() {
    const completed = todos.filter(t => t.done);
    const promises = completed.map(t => destroyTodo(t.id));

    Promise.all(promises).then(render);
  }

  function onCreateTodo(e) {
    const code = e.keyCode;
    const title = this.value.trim();

    if (code !== 13 || !title) return;

    this.value = '';
    createTodo(title).then(render);
  }

  function onTodoClick(e) {
    const target = e.target;
    const todoId = target.parentElement.parentElement.getAttribute('data-todo-id');
    
    if (hasClass(target, 'toggle'))  {
      const todo = todos.find(t => t.id == todoId);
      todo.done = !todo.done;

      updateTodo(todo).then(render);
    } else if (hasClass(target, 'destroy')) {
      destroyTodo(todoId);
    }
  }

  const createTodo = (title) => {
    const todo = {
      title: title,
      done: false
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(todo)
    };

    return request('/todos', options).then(todo => {
      todos.push(todo);
    });
  };

  const updateTodo = (todo) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(todo)
    };

    return request(`/todos/${todo.id}`, options).then(todo => {

    });
  };

  const destroyTodo = (todoId) => {
    const options = {
      method: 'DELETE'
    };

    return request(`/todos/${todoId}`, options).then(response => {
      todos = response;
    });
  };

  const init = () => {
    loadTodos().then(render);
    addEvents();
  };

  document.addEventListener("DOMContentLoaded", init);
})();