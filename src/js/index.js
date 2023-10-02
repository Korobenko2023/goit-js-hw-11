// import { renderImages } from'./markup';
import { fetchImages } from './gallery-api';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
export let page = 1;

let currentSearchQuery = '';

const refs = {
    container: document.querySelector('.gallery'),
    form: document.querySelector('.search-form'), 
    load: document.querySelector('.load-more'),   
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250
 }); 

refs.container.classList.add('visually-hidden');
refs.load.classList.add('visually-hidden');
 
refs.form.addEventListener('submit', onSearchImages);
refs.load.addEventListener('click', onLoadMore);

async function onSearchImages(event) {
event.preventDefault();
const form = event.currentTarget;
const requestWord = form.elements.searchQuery.value;
if (requestWord === "") {
  Notiflix.Notify.warning("Please fill the field!");
  return;
} 

page = 1;
currentSearchQuery = requestWord;

try {
  const { hits, totalHits } = await fetchImages(currentSearchQuery);
  if (totalHits === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
      return;
  } 
  
  refs.container.innerHTML = '';
  renderImages(hits);
  lightbox.refresh(); 
  refs.container.classList.remove('visually-hidden');
  refs.load.classList.remove('visually-hidden');
  
 if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
 }
} catch (error) {
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
} finally {   
  refs.form.reset();  
}
}


function renderImages(arr) {
  const markup = arr
  .map(({ webformatURL,largeImageURL, tags, likes, views, comments, downloads }) => {
  return `<li class="gallery__item">
 <a class="photo-card" href="${largeImageURL}">
 <img src="${webformatURL}" width="325" height="230 alt="${tags}" loading="lazy" />
 <div class="info">
   <p class="info-item"><b>Likes ${likes}</b></p>
   <p class="info-item"><b>View ${views}</b></p>
   <p class="info-item"><b>Comments ${comments}</b></p>
   <p class="info-item"><b>Downloads ${downloads}</b></p>
 </div>
</a>
</li>`
}).join('');
refs.container.insertAdjacentHTML('beforeend', markup);
}


async function onLoadMore() {
  page++; 
  try {
    const { hits, totalHits } = await fetchImages(currentSearchQuery);
    renderImages(hits);
    lightbox.refresh(); 
    if ((page - 1) * 40 >= totalHits) {
      refs.load.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
      refs.load.classList.remove('visually-hidden');
  }
} catch (error) {
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
}
  }
