// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3004/api', // Base URL for your API
    withCredentials: true // Allow sending cookies with requests
});

export default instance;
