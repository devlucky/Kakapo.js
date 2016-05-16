(function() {
  let todos = [];
  const $ = (selector) => {
    return document.querySelector(selector);
  };
  const request = (url, options) => {
    const request = new Request(url);

    return fetch(request, options).then(r => r.json());
  };

  const render = () => {
    let todosLeft = 0;
    const todosHtml = todos.map(t => {
      if (!t.done) todosLeft++;

      return todoTemplate(t);
    }).join('');

    $('.todo-list').innerHTML = todosHtml;
    $('.todo-count strong').innerText = todosLeft;
    $('.footer').hidden = !todos.length;
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
        <label>${todo.title}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `;
  };

  const addEvents = () => {
    $('.todo-list').addEventListener('click', onTodoClick);
    $('.new-todo').addEventListener('keyup', onCreateTodo);
  };

  function onCreateTodo(e) {
    const code = e.keyCode;
    const title = this.value.trim();

    if (code !== 13 || !title) return;

    this.value = '';
    createTodo(title).then(render);
  }

  function onTodoClick(e) {
    const target = e.target;
    const classList = target.classList;
    const todoId = target.parentElement.parentElement.getAttribute('data-todo-id');
    
    if (classList.contains('toggle'))  {
      const todo = todos.find(t => t.id == todoId);
      todo.done = !todo.done;

      updateTodo(todo).then(render);
    } else if (classList.contains('destroy')) {
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

    return request(`/todos/${todoId}`, options).then(todo => {
      todos.push(todo);
    });
  };

  const init = () => {
    loadTodos().then(render);
    addEvents();
  };

  document.addEventListener("DOMContentLoaded", init);
})();