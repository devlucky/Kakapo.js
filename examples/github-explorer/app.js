(function() {
  const host = 'https://api.github.com';
  let users = [];

  const render = () => {
    const usersHtml = users.map(userTemplate).join('');

    $('#user-list').html(usersHtml);
  };

  const userTemplate = (user) => {
    const login = user.login;

    return `
    <li class="collection-item avatar" data-login="${login}">
      <img src="${user.avatar_url}" alt="" class="circle">
      <span class="title">${login}</span>
      <p>
        ${user.html_url}
      </p>
      <a href="#!" class="secondary-content">
        <i class="material-icons">send</i>
      </a>
    </li>
    `;
  };

  const loadUsers = () => {
    const xhr = $.get(`${host}/users`);

    return xhr.then(r => {
      users = r;    
    });
  };

  const loadUser = (login) => {
    const xhr = $.get(`${host}/users/${login}`);

    return xhr.then(r => {
      debugger;
    });
  }

  const addEvents = () => {
    $('#user-list').on('click', 'li', onUserClick);
  };  

  const onUserClick = function() {
    const login = $(this).attr('data-login');

    loadUser(login);
  };

  const init = () => {
    loadUsers().then(render);

    addEvents();
  };

  document.addEventListener("DOMContentLoaded", init);
})();