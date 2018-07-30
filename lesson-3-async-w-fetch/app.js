(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');
  let figureDiv;
  let articlesDiv;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    searchedForText = searchField.value;

    resetContainer();
    requestImage(searchedForText);
    requestArticles(searchedForText);
  });

  function resetContainer() {
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    figureDiv = document.createElement('div');
    responseContainer.appendChild(figureDiv);

    articlesDiv = document.createElement('div');
    responseContainer.appendChild(articlesDiv);
  }

  function requestImage(searchedForText) {
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
      headers: {
        'Authorization': 'Client-ID d7cb1f9fd28e1832f1718639df593eb0faf813897331b96d0b0243670708f072'
      }
    })
      .then(response => response.json())
      .then(addImage)
      .catch(e => requestError(e, 'image'));
  }

  function requestArticles(searchedForText) {
    fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=965915652ca14294baf33b5f5631c146`)
    .then(response => response.json())
    .then(addArticles)
    .catch(e => requestError(e, 'articles'));
  }

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
  }

  function addImage(data) {
    if (data && data.results && data.results[0]) {
      const image = data.results[0];

      figureDiv.appendChild(createImage(image));
    } else {
      const div = document.createElement('div');
      div.classList = ['error-no-image'];
      div.innerHTML = 'No images found for this topic.';
      figureDiv.appendChild(div);
    }
  }

  function addArticles(data) {
    if (data && data.response && data.response.docs.length > 0) {
      const ul = document.createElement('ul');
      articlesDiv.appendChild(ul);

      for (var i = 0; i < data.response.docs.length; i++) {
        var articleObj = data.response.docs[i];
        ul.appendChild(createArticle(articleObj));
      }
    } else {
      const div = document.createElement('div');
      div.classList = ['error-no-articles'];
      div.innerHTML = 'No articles found for this topic.';
      articlesDiv.appendChild(div);
    }
  }

  function createImage(imageObj) {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = imageObj.urls.regular;
    img.alt = imageObj.description + ' by ' + imageObj.user.first_name + ' ' + imageObj.user.last_name;
    figure.appendChild(img);

    const figcap = document.createElement('figcaption');
    figcap.innerText = imageObj.description + ' by ' + imageObj.user.first_name + ' ' + imageObj.user.last_name;
    figure.appendChild(figcap);

    return figure;
  }

  function createArticle(articleObj) {
    const li = document.createElement('li');
    li.classList = ['article'];

    const h2 = document.createElement('h2');
    h2.innerHTML = articleObj.headline.main;
    li.appendChild(h2);

    const par = document.createElement('p');
    par.innerHTML = articleObj.snippet;
    li.appendChild(par);

    const linkDiv = document.createElement('div');
    li.appendChild(linkDiv);

    const link = document.createElement('a');
    link.innerHTML = 'Read more on ' + articleObj.headline.main;
    link.href = articleObj.web_url;
    linkDiv.appendChild(link);

    return li;
  }
})();
