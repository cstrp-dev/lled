import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000');

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.response.use(
    response => response,
    error => Promise.reject(error)

);

api.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
);

export { api }
