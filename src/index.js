import getImages  from './pixabay-api';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
    searchForm: document.querySelector('#search-form'),
    searchQuery: document.querySelector('input[name="searchQuery"]'),
    galleryList: document.querySelector('.gallery'),
    target: document.querySelector('.target'),
};

let currentPage = 1;
let inputValue = '';

let lightbox = new SimpleLightbox('.photo-link', {
    captionDelay: 250,
    captionsData: 'alt',
});

let options = {
    root: null,
    rootMargin: '200px',
    threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

refs.searchForm.addEventListener('submit', handlerForm);

async function handlerForm(event) {
    event.preventDefault();

    currentPage = 1;

    refs.galleryList.innerHTML = '';

    observer.unobserve(refs.target);

    const inputValue = formValue(event);

    if (!inputValue) {
        Notiflix.Notify.warning(
            'Please enter your search query before clicking the search button'
        );
        return;
    }

    try {
        const data = await getImages(inputValue, currentPage);

        refs.searchQuery.value = '';

        if (data.hits.length === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

        addImagesToGallery(data);

        observer.observe(refs.target);

        lightbox.refresh();
    } catch (error) {
        console.log(error);
    }
}

async function onLoad(entries, observer) {
    entries.forEach(async entry => {
        if (entry.isIntersecting) {
            try {
                const data = await getImages(inputValue, (currentPage += 1));

                addImagesToGallery(data);

                lightbox.refresh();

                if (currentPage >= Math.ceil(data.totalHits / 40)) {
                    observer.unobserve(refs.target);
                    Notiflix.Notify.warning(
                        "We're sorry, but you've reached the end of search results."
                    );
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
}


function createMarkup(arr) {
    return arr
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => `
        <div class="photo-card">
            <a class="photo-link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                    </p>
                </div>
            </a>
        </div>
    `
        )
        .join('');
}

function addImagesToGallery(data) {
    refs.galleryList.insertAdjacentHTML('beforeend', createMarkup(data.hits));
}

function formValue(event) {
    const { searchQuery } = event.currentTarget.elements;
    inputValue = searchQuery.value.trim();

    return inputValue;
}

Notiflix.Notify.init({
    fontSize: '15px',
    cssAnimation: true,
    cssAnimationDuration: 400,
    cssAnimationStyle: 'fade',
});
