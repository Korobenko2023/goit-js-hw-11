import { renderImages } from'./markup';
import { fetchImages } from './gallery-api';
import { refs } from './refs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

export let page = 1;
export let per_page = 40;

let currentSearchQuery = '';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250
 }); 

const observer = new IntersectionObserver(handleObserver);

refs.container.classList.add('visually-hidden');
refs.load.classList.add('visually-hidden');
 
refs.form.addEventListener('submit', onSearchImages);

async function onSearchImages(event) {
event.preventDefault();
const form = event.target;
const requestWord = form.elements.searchQuery.value.trim();

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

  observer.observe(document.getElementById("infinite-scroll-trigger"));  
 
  if (page === 1) {   
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);   
  }
   
  const totalPages = Math.ceil(totalHits / per_page);
  if (page >= totalPages) {   
   Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
   observer.unobserve(document.getElementById("infinite-scroll-trigger"));  
  } 

} catch (error) {
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
} finally {   
  refs.form.reset();  
}
}

async function onLoadMore() {
  page++; 
  try {
    const { hits, totalHits } = await fetchImages(currentSearchQuery);       
    const totalPages = Math.ceil(totalHits / per_page);

    renderImages(hits);
    lightbox.refresh();   

    if (page >= totalPages)  {          
     Notiflix.Notify.info("We're sorry, but you've reached the end of search results."); 
     observer.unobserve(document.getElementById("infinite-scroll-trigger"));   
    } 
    
} catch (error) {
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
} 
  }

  function handleObserver(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { 
       onLoadMore();
      }
    });
  }
 