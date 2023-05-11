import axios from 'axios';

const urlAuth = `${process.env.REACT_APP_API_KEY_YT}`;
const urlGsheet = `${process.env.REACT_APP_API_KEY_GG}`

export const API_AUTH = axios.create({
    baseURL: urlAuth,
});

export const API_GSHEET = axios.create({
    baseURL: urlGsheet,
})