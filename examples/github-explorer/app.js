(function() {
  const host = 'https://api.github.com';

  const loadUsers = () => {
    const xhr = $.get(`${host}/users`);
    // window.XMLHttpRequest = null
    // $.get(`${host}/users`).then(r => {
    xhr.then(r => {
      debugger;
    });

    xhr.error(err => {
      console.log(err);
    });

    // xhr.fail(err => {
    //   debugger
    // })
  };

  const init = () => {
    loadUsers();
  };

  document.addEventListener("DOMContentLoaded", init);
})();