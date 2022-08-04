import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

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

let query = '';
const per_page = 40;
let currentPage = 1;

offReadMoreBtn();
offNoMorePagesMessage();

const fetchPics = query => {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${currentPage}&per_page=${per_page}`
  )
    .then(r => r.json())
    .then(r => {
      const hitsArr = r.hits;
      if (hitsArr.length === 0) {
        return Promise.reject(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        return {
          galleryArr: hitsArr,
          totalHits: r.totalHits,
        };
      }
    });
};

const renderMarkupGallery = ({ galleryArr, totalHits }) => {
  if (currentPage === 1) {
    Notify.success(`Hoooray! We found ${totalHits} images!`);
  }
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
  console.log(currentPage * per_page);
  console.log(totalHits);
  console.log(totalHits % per_page);

  const isLastRender =
    currentPage * per_page - totalHits >= totalHits % per_page;

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
};

const createGallery = () => {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  lightbox.on('show.simplelightbox');
};

const showErrors = error => Notify.failure(error);

const startSearch = event => {
  event.preventDefault();
  currentPage = 1;
  offReadMoreBtn();
  offNoMorePagesMessage();

  refs.galleryEl.innerHTML = '';
  query = refs.searchInputEl.value;
  console.log(refs.searchInputEl.value);

  fetchPics(query)
    .then(renderMarkupGallery)
    .then(addGallery)
    .then(createGallery)
    .catch(showErrors);
};

const loadMore = () => {
  offReadMoreBtn();

  fetchPics(query)
    .then(renderMarkupGallery)
    .then(addGallery)
    .then(createGallery)
    .catch(showErrors);
};

refs.btnSearchEl.addEventListener('click', startSearch);
refs.btnMoreEl.addEventListener('click', loadMore);

// -------------------------------------------------------------------

// const renderMarkupGalleryOld = galleryArr => {
//   const markupGallery = galleryArr
//     .map(img => {
//       return `
//   <div class="photo-card">
//        <a href="${img.largeImageURL}">
//         <img class="gallery__image" src="${img.webformatURL}" alt="" loading="lazy" />
//         </a>
//       <div class="info">
//             <p class="info-item">
//                 <b>Likes<br>${img.likes}</b>
//             </p>
//             <p class="info-item">
//             <b>Views<br>${img.views}</b>
//             </p>
//             <p class="info-item">
//             <b>Comments<br>${img.comments}</b>
//             </p>
//             <p class="info-item">
//             <b>Downloads<br>${img.downloads}</b>
//             </p>
//       </div>
//   </div>
//       `;
//     })
//     .join('');
//   currentPage += 1;
//   return markupGallery;
// };

// const addGalleryOld = markupGallery => {
//   refs.galleryEl.insertAdjacentHTML('beforeend', markupGallery);
//   onReadMoreBtn();
// };

//   const fetchPicsOld = query => {
//     return fetch(
//       `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${currentPage}&${per_page}`
//     )
//       .then(r => r.json())
//       .then(r => r.hits)
//       .catch(console.log);
//   };
