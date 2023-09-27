import axios from "axios";
axios.defaults.headers.common["x-api-key"] = "live_AjlxCbLIu6QxMy1La6yi4tYaWd7WEJMxrplNzXLhmLw0KTUQp9bBtpZcf4znrVR6";

export function fetchBreeds() { 
   return axios
.get('https://api.thecatapi.com/v1/breeds')
.then(response => {  
    return response.data;     
    })
.catch(error => {
        throw error;
    });
}

export function fetchCatByBreed(breedId) {    
    return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => { 
        return response.data;
    })
    .catch(error => {
        throw error;
    });
}

