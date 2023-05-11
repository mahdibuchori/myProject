import axios from 'axios';
import env from "react-dotenv";
const urlAuth = `${env.REACT_APP_API_KEY_YT}`;
const urlGsheet = `${env.REACT_APP_API_KEY_GG}`

export const API_AUTH = axios.create({
    baseURL: urlAuth,
});

export const API_GSHEET = axios.create({
    baseURL: urlGsheet,
})