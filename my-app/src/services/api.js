import axios from 'axios';

// 1. Create the base instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', 
});

// 2. The Interceptor (Adds the token to every request automatically)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ------------------- USERS -------------------
export const fetchUsers = () => API.get('/users');
export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (userData) => API.post('/users/login', userData);

// ------------------- JOBS -------------------
export const fetchJobs = () => API.get('/jobs');

// FIX: Use 'API.get' instead of 'axios.get' and use the relative path
export const fetchJobById = (id) => API.get(`/jobs/${id}`);

export const createJob = (jobData) => API.post('/jobs', jobData);

// ------------------- PAYMENTS -------------------
export const initializePayment = (paymentData) => API.post('/payments/init', paymentData);
export const verifyPayment = (reference) => API.get(`/payments/verify/${reference}`);

export default API;