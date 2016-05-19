(function() {
  const host = 'https://api.github.com';
  let users = [];
  let searchTimeout = null;
  let lastSearchValue = '';

  const render = () => {
    const usersHtml = users.map(userTemplate).join('');

    $('#user-list').html(usersHtml);
  };

  const renderUser = (user) => {

    const userHtml = `
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${user.avatar_url}">
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">Card Title</span>
        <p></p>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">Card Title</span>
        <p>Here is some more information about this product that is only revealed once clicked on.</p>
      </div>
    `;

    $('#userModal .modal-content').html(userHtml);
    $('#userModal').openModal();
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

    return xhr.then(user => {
      renderUser(user);
    });
  };

  const searchUsers = (query = '', sort = 'followers', order = 'desc') => {
    //TODO: UI -> display sort options
    //TODO: UI -> display order toggling
    const uri = `${host}/search/users?q=${query}&sort=${sort}&order=${order}`;
    const xhr = $.get(uri);

    xhr.then(r => {
      users = r;

      loadingState(false);
    });

    return xhr;
  };

  const addEvents = () => {
    $('.modal-trigger').leanModal();
    $('#user-list').on('click', 'li', onUserClick);
    $('#search').on('keyup', onSearch);
  };  

  const loadingState = (state) => {
    const action = state ? 'addClass' : 'removeClass';

    $('#users-loader')[action]('active');
  };

  const onSearch = function() {
    const value = this.value;
    if (lastSearchValue === value) return;

    lastSearchValue = value;

    loadingState(true);
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(_ => searchUsers(value).then(render), 500);
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