import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28999251-52156a0b70764a414979b8adf';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

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
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=1&per_page=40`
  )
    .then(r => r.json())
    .then(r => r.hits)
    .catch(console.log);
};

const renderMarkupGallery = galleryArr => {
  return galleryArr
    .map(img => {
      return `
  <div class="photo-card">
       <a href="${img.largeImageURL}">
        <img class="gallery__image" src="${img.webformatURL}" alt="" loading="lazy" />
        </a>
      <div class="info">
            <p class="info-item">
                <b>Likes<br>${img.likes}</b>
            </p>
            <p class="info-item">
            <b>Views<br>${img.views}</b>
            </p>
            <p class="info-item">
            <b>Comments<br>${img.comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads<br>${img.downloads}</b>
            </p>
      </div>
  </div>
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
