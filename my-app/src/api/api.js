import axios from "axios";

// Base URL of your backend
const BASE_URL = "http://localhost:5000/api";

// ------------------- USERS -------------------
// Fetch all users
export const fetchUsers = () => axios.get(`${BASE_URL}/users`);

// Register a new user
export const registerUser = (userData) => axios.post(`${BASE_URL}/users/register`, userData);

// Login a user
export const loginUser = (userData) => axios.post(`${BASE_URL}/users/login`, userData);

// ------------------- PAYMENTS -------------------
// Initialize payment
export const initializePayment = (paymentData) => axios.post(`${BASE_URL}/payments/init`, paymentData);

// Verify payment
export const verifyPayment = (reference) => axios.get(`${BASE_URL}/payments/verify/${reference}`);

// ------------------- JOBS -------------------
// Fetch all jobs
export const fetchJobs = () => axios.get(`${BASE_URL}/jobs`);

// Create a new job
export const createJob = (jobData) => axios.post(`${BASE_URL}/jobs`, jobData);
