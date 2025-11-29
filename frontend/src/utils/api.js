import axios from 'axios';

// Cambia la configuración base para usar variable de entorno
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1', 
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;