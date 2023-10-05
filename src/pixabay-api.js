import axios from 'axios';

export async function getImages(name, page) {
    Notiflix.Loading.standard();

    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '39796826-5323de49fb67ecd68459fdb2a';

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