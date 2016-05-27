//TODO: Use robo hash api for avatars
//TODO: Use loading button
//TODO: Display audio
(function() {
  const defaultWord = 'car';
  const $ = (selector) => document.querySelector(selector);
  const mashapeKey = 'ksCiJLTf8JmshcQNltvFbKg85wQnp1SHPShjsnPvLfB1Awf8II';
  const host = 'https://mashape-community-urban-dictionary.p.mashape.com';
  const elements = {};
  const request = (url) => {

    return new Promise((resolve, reject) => {
      superagent
        .get(url)
        .set('X-Mashape-Key', mashapeKey)
        .end(function(err, res) {
          debugger
          if (err) return reject(err);

          resolve(res.body);
        });
    });
  }
  const render = (res) => {
    const columnsPerRow = 3;
    const delimiter = '</div><div class="columns">';
    const results = res.list;
    const tags = res.tags;
    const resultsHtml = results.map((result, i) => {
      const closingTag = ((i + 1) % columnsPerRow === 0 ? delimiter : '');
      return resultTemplate(result) + closingTag;
    }).join('');
    const tagsHtml = tags.map(tagTemplate).join('');

    elements.tagsContainer.innerHTML = tagsHtml;
    elements.wordsContainer.innerHTML = `<div class="columns">${resultsHtml}</div>`;    
  };

  const tagTemplate = (tag) => {
    return `
      <span class="tag is-dark js-tag">${tag}</span>
    `;
  };

  const resultTemplate = (result) => {

    return `
      <div class="column box result__container">
        <h1>${result.word}</h1>
        <div class="result__info">
          <div class="result__definition">${result.definition}</div>
          <div class="result__example">${result.example}</div>
          <div class="result__show-more">
            <div class="result__show-more__button">Show more</div>
          </div>
        </div>
        <div class="result__footer">
          By <a href="http://www.urbandictionary.com/author.php?author=${result.author}" target="_blank">${result.author}</a>
           - <a href="${result.permalink}" target="_blank">visit</a>
          <span class="icon">
            <i class="fa fa-thumbs-up"></i>
          </span>
          ${result.thumbs_down}
          <span class="icon">
            <i class="fa fa-thumbs-down"></i>
          </span>
          ${result.thumbs_up}
        </div>
      </div>
    `;
  };

  const onTagClick = function(e) {
    const target = e.target;
    if (!target.classList.contains('js-tag')) return;

    const tag = target.textContent;

    elements.input.value = tag;
    fetchWord(tag).then(render);
  };

  const onEnterWord = function(e) {
    const code = e.charCode;
    if (code !== 13) return;

    onSearchWord();
  };

  const onSearchWord = function() {
    const word = elements.input.value;

    fetchWord(word).then(res => {
      render(res);
    });
  };

  const fetchWord = (word) => {
    const url = `${host}/define?term=${word}`;

    elements.button.classList.add('is-loading');

    // return fetch(url).then(r => r.json()).then(res => {
    //   debugger
    // });

    //Superagent
    return request(url).then(res => {
      debugger;
      elements.button.classList.remove('is-loading');
      return res;
    }).catch(err => {
      console.log(err);
    });
  };

  const onShowMoreClick = function(e) {
    const target = e.target;

    if (!target.classList.contains('result__show-more__button')) return;

    const container = target.parentElement.parentElement;

    container.classList.add('result__info-overflow');
  };

  const addEvents = () => {
    elements.input.addEventListener('keypress', onEnterWord);
    elements.button.addEventListener('click', onSearchWord);
    elements.tagsContainer.addEventListener('click', onTagClick);
    elements.wordsContainer.addEventListener('click', onShowMoreClick);
  };

  const init = () => {
    elements.button = $('.js-search-word');
    elements.input = $('.js-word');
    elements.wordsContainer = $('.js-words-container');
    elements.tagsContainer = $('.js-tags-container');

    fetchWord(defaultWord).then(render);
    addEvents();
  };

  document.addEventListener("DOMContentLoaded", init);
})();