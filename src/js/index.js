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

refs.container.classList.add('visually-hidden');
refs.load.classList.add('visually-hidden');
 
refs.form.addEventListener('submit', onSearchImages);
refs.load.addEventListener('click', onLoadMore);

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

async function onLoadMore() {
  page++; 
  try {
    const { hits, totalHits } = await fetchImages(currentSearchQuery);   
    const totalPages = Math.ceil(totalHits / per_page);
    if (page >= totalPages) { 
      refs.load.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
     return;
  } else {
      refs.load.classList.remove('visually-hidden');
  }

  renderImages(hits);
  lightbox.refresh();  
  scrollToNextGroup();

} catch (error) {
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
}
  }

  function scrollToNextGroup() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }

  // function hendlerObserver(entries) {
  //   entries.forEach(async (entry) => {
  //     if (entry.isIntersection) {
  //       page++;
  //       try {
  //         const { hits, totalHits } = await fetchImages(currentSearchQuery);
  //         const totalPages = Math.ceil(totalHits / per_page);
  //         if (page >= totalPages) {
  //           Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  //           return;
  //         }
  
  //         renderImages(hits);
  //         lightbox.refresh();
  //       } catch (error) {
  //         Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
  //       }
  //     }
  //   });
  // }

  
// async function onLoadMore() {
//   page++; 
//   try {
//     const { hits, totalHits } = await fetchImages(currentSearchQuery);   
//     const totalPages = Math.ceil(totalHits / per_page);
//     if (page >= totalPages) { 
//       // isObserving = false;
//       // observer.unobserve(refs.jsGuard);
//       // refs.load.classList.add('visually-hidden');
//       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//       // endOfResultsNotified = true;
//       return;
//   }       
//   // else {
//   //     refs.load.classList.remove('visually-hidden');
//   // }

//   renderImages(hits);
//   lightbox.refresh();  
//   // scrollToNextGroup();
   
  

// } catch (error) {
//   Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', error);
// }
//   }

//   function hendlerObserver(entries) {
//     console.log(entries);
//     entries.forEach(async (entry) => {
//       if (entry.isIntersection) {
//         // observer.unobserve(refs.jsGuard);
//         onLoadMore();
//       }
//     });
//   }

 