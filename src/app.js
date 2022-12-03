const form = document.querySelector('.search-form');
const container = document.querySelector('.container');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const formData = new FormData(event.target);

  const response = await fetch('/.netlify/functions/unsplash-search', {
    method: 'POST',
    body: JSON.stringify({
      query: formData.get('query'),
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  try {
    /*
    Loop through the results[] array. For each result, create a clone of the
    template and append it to the DOM element with the .container class.
    */
    if (response.results) {
      response.results.forEach((dataObj) => {
        const clone = document.querySelector('#template').content.firstElementChild.cloneNode(true);
        const postImg = clone.querySelector('.post__img');
        const postUser = clone.querySelector('.post__user');
        const postDescription = clone.querySelector('.post__desc');

        /*
        Add an attribution statement below the image using the
        postUser element and the photographer's name from dataObj
        */
        if (dataObj.user.first_name || dataObj.user.last_name) {
          postUser.textContent = `by ${dataObj.user.first_name || ''} ${dataObj.user.last_name || ''}`;
        }

        /*
        Check the description of the post. If it's bot bull and less than 100 characters,
        add the description from dataObj to the post. If it's more than 100 characters,
        add the first 100 characters of the description from dataObj to the post followed by
        an ellipsis (...)
        */
        let displayedDescription = dataObj.description;
        if (displayedDescription) {
          if (typeof displayedDescription === 'string' && displayedDescription.length > 100) {
            displayedDescription = `${displayedDescription.slice(0, 100)}...`;
          }
        } else {
          displayedDescription = '';
        }

        postImg.src = dataObj.urls.small;
        postImg.alt = dataObj.alt_description;

        postDescription.textContent = `${displayedDescription}`;

        container.appendChild(clone);
      });
    }
  } catch (error) {
    container.textContent = 'An error has occured.';
  }
});
