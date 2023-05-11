import axios from 'axios';

const urlAuth = 'https://panel.dagsapp.com/dpanel';
const urlGsheet = 'https://script.google.com/macros/s/AKfycbw8GFlO5oyfOUhmHntCwoXi5pJpxBtxvh3sYkePeVFu08CZrf06HQ6FHvYFHqscczTZ';

export const API_AUTH = axios.create({
    baseURL: urlAuth,
});

export const API_GSHEET = axios.create({
    baseURL: urlGsheet,
})