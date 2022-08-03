import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28999251-52156a0b70764a414979b8adf';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

const formEl = document.querySelector('#search-form');
const refs = {
  searchInputEl: formEl.querySelector('input'),
  btnSearchEl: formEl.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  btnMoreEl: document.querySelector('.load-more'),
};

const offReadMoreBtn = () => refs.btnMoreEl.classList.add('invisible');
const onReadMoreBtn = () => refs.btnMoreEl.classList.remove('invisible');

let query = '';
const per_page = 40;
let currentPage = 12;

offReadMoreBtn();

const fetchPics = query => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${currentPage}&${per_page}`
  )
    .then(r => r.json())
    .then(r => r.hits)
    .catch(console.log);
};

const renderMarkupGallery = galleryArr => {
  const markupGallery = galleryArr
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
  currentPage += 1;
  return markupGallery;
};

const addGallery = markupGallery => {
  refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
  onReadMoreBtn();
};

const createGallery = () => {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  lightbox.on('show.simplelightbox');
};

const startSearch = event => {
  event.preventDefault();
  refs.galleryEl.innerHTML = '';
  query = refs.searchInputEl.value;
  console.log(refs.searchInputEl.value);

  fetchPics(query)
    .then(renderMarkupGallery)
    .then(addGallery)
    .then(createGallery);
};

const loadMore = () => {
  offReadMoreBtn();
  fetchPics(query)
    .then(renderMarkupGallery)
    .then(addGallery)
    .then(createGallery);
};

refs.btnSearchEl.addEventListener('click', startSearch);
refs.btnMoreEl.addEventListener('click', loadMore);

// -------------------------------------------------------------------

const fetchPicsTest = query => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${currentPage}&per_page=${per_page}`
  )
    .then(r => r.json())
    .then(r => {
      const hitsArr = r.hits;
      if (hitsArr.length === 0) {
        return Promise.reject('not found');
      } else {
        return {
          galleryArr: hitsArr,
          totalHits: r.totalHits,
        };
      }
    });
};

const renderMarkupGalleryTest = ({ galleryArr, totalHits }) => {
  const markupGallery = galleryArr
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
  currentPage += 1;
  const isLastRender = currentPage > Math.floor(totalHits / per_page);
  return { isLastRender, markupGallery };
};

const addGalleryTest = ({ isLastRender, markupGallery }) => {
  refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
  if (!isLastRender) {
    onReadMoreBtn();
  }
};

fetchPicsTest('trasdrtey')
  .then(renderMarkupGalleryTest)
  .then(addGalleryTest)
  .then(createGallery)
  .catch(console.log);
//(currentPage <= Math.floor(r.totalHits / per_page)
