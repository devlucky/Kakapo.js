(function() {
  let todos = [];
  const $ = (selector) => {
    return document.querySelector(selector);
  };
  const request = () => {

  };

  const render = () => {
    let todosLeft = 0;
    const todosHtml = todos.map(t => {
      if (!t.done) todosLeft++;

      return todoTemplate(t);
    });

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

    return `
    <li class="${classNames}">
      <div class="view">
        <input class="toggle" type="checkbox">
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
    const val = this.value.trim();

    if (code !== 13 || !val) return;

    createTodo(val);
  }

  function onTodoClick(e) {
    const target = e.target;
    const classList = target.classList;

    if (classList.contains('toggle'))  {

      updateTodo(todo);
    } else if (classList.contains('destroy')) {
      destroyTodo(todo);
    }
  }

  const createTodo = (value) => {
    const options = {
      method: 'POST'
    };
    const request = new Request('/todos');

    fetch(request, options).then(response => {

    });
  };

  const updateTodo = (todo) => {
    const options = {
      method: 'PUT'
    };
    const request = new Request('/todos');

    fetch(request, options).then(response => {

    });
  };

  const destroyTodo = (todo) => {

  };

  const init = () => {
    loadTodos().then(render);
    addEvents();
  };

  document.addEventListener("DOMContentLoaded", init);
})();