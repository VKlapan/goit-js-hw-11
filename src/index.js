import SimpleLightbox from 'simplelightbox';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28999251-52156a0b70764a414979b8adf';

let query = '';
const formEl = document.querySelector('#search-form');

const refs = {
  searchInputEl: formEl.querySelector('input'),
  btnSearchEl: formEl.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
};

const startSearch = event => {
  event.preventDefault();
  query = refs.searchInputEl.value;
  console.log(refs.searchInputEl.value);
  fetchPics(query)
    .then(renderMarkupGallery)
    .then(addGallery)
    .then(createGallery);
};

refs.btnSearchEl.addEventListener('click', startSearch);

console.log(query);

const fetchPics = query => {
  return fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&page=1&per_page=10`)
    .then(r => r.json())
    .then(r => r.hits)
    .catch(console.log);
};

const renderMarkupGallery = galleryArr => {
  return galleryArr
    .map(img => {
      return `
        <a href="${img.largeImageURL}">
  <img src="${img.webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${img.likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${img.views} Views</b>
    </p>
    <p class="info-item">
      <b>${img.comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${img.downloads} Downloads</b>
    </p>
  </div>
</a>
      `;
    })
    .join('');
};

const addGallery = markupGallery => {
  refs.galleryEl.innerHTML = '';
  refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
};

const createGallery = () => {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  lightbox.on('show.simplelightbox');
};
