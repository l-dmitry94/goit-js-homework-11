import axios from 'axios';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

export async function getImages(name, page) {
    Notiflix.Loading.standard();

    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '41528122-08bf6ff4052e91093ac35f1ea';

    const params = new URLSearchParams({
        q: name,
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
    });

    const response = await axios({
        method: 'GET',
        url: `${BASE_URL}?${params}`,
    });

    Notiflix.Loading.remove();

    return response.data;
}