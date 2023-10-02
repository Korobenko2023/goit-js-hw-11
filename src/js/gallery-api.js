import axios from "axios";
import { page, per_page } from './index';

export async function fetchImages(requestWord) { 
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '39706325-fc42f933f9753c8c7490c2cf4';
    const params = {
        key: API_KEY,
        q: requestWord,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: per_page,
    };    
    try {
     const response = await axios.get(BASE_URL, { params });  
     const { hits, totalHits } = response.data;
     return { hits, totalHits };
    } catch (error) {
        throw error;
    }
}


