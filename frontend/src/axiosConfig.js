// src/axiosConfig.js
import axios from 'axios';

// Axios instance for microservice on port 3004
const apiInstance = axios.create({
    baseURL: 'http://localhost:3004/api',
    withCredentials: true // Allow sending cookies with requests
});

// Axios instance for microservice-trade on port 3003
const tradeApiInstance = axios.create({
    baseURL: 'http://localhost:3003/api',
    withCredentials: true // Allow sending cookies with requests
});

export { apiInstance, tradeApiInstance };
