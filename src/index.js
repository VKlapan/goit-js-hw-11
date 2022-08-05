import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import { getPics } from './getPics';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28999251-52156a0b70764a414979b8adf';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

const formEl = document.querySelector('#search-form');
const refs = {
  searchInputEl: formEl.querySelector('input'),
  btnSearchEl: formEl.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  btnMoreEl: document.querySelector('.load-more'),
  noMoreMessageEl: document.querySelector('.no-more-pages'),
};

const offReadMoreBtn = () => refs.btnMoreEl.classList.add('invisible');
const onReadMoreBtn = () => refs.btnMoreEl.classList.remove('invisible');

const offNoMorePagesMessage = () =>
  refs.noMoreMessageEl.classList.add('invisible');
const onNoMorePagesMessage = () =>
  refs.noMoreMessageEl.classList.remove('invisible');

const getUrl = () => {
  url = `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${currentPage}&per_page=${per_page}`;
};

let query = '';
const per_page = 40;
let currentPage = 1;
let url = '';
let lightbox = null;

getUrl();
offReadMoreBtn();
offNoMorePagesMessage();

const renderMarkupGallery = ({ galleryArr, totalHits }) => {
  if (currentPage === 1) {
    Notify.success(`Hoooray! We found ${totalHits} images!`);
  }
  const markupGallery = galleryArr
    .map(img => {
      return `
  <div class="photo-card">
       <a href="${img.largeImageURL}">
        <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
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

  const isLastRender =
    totalHits - currentPage * per_page < totalHits % per_page;

  currentPage += 1;

  return { isLastRender, markupGallery };
};

const addGallery = ({ isLastRender, markupGallery }) => {
  refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
  if (!isLastRender) {
    onReadMoreBtn();
  } else {
    onNoMorePagesMessage();
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 11,
    behavior: 'smooth',
  });
};

const createLightBox = () => {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
};

const showGaleryPage = ({ galleryArr, totalHits }) => {
  const { isLastRender, markupGallery } = renderMarkupGallery({
    galleryArr,
    totalHits,
  });
  addGallery({ isLastRender, markupGallery });
};

const showErrors = error => Notify.failure(error);

const startSearch = async event => {
  event.preventDefault();
  currentPage = 1;
  offReadMoreBtn();
  offNoMorePagesMessage();

  refs.galleryEl.innerHTML = '';
  query = refs.searchInputEl.value;
  refs.searchInputEl.value = '';
  getUrl();

  await getPics(url).then(showGaleryPage).catch(showErrors);

  createLightBox();
  lightbox.on('');
};

const loadMore = async () => {
  offReadMoreBtn();
  getUrl();

  await getPics(url).then(showGaleryPage).catch(showErrors);

  lightbox.refresh();
};

refs.btnSearchEl.addEventListener('click', startSearch);
refs.btnMoreEl.addEventListener('click', loadMore);

// -------------------------------------------------------------------

// try to add endless scroll
