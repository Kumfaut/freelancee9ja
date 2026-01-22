import axios from "axios";

// 1. Set the Base URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// 2. Create an Axios Instance
const API = axios.create({
    baseURL: BASE_URL,
});

// 3. The Interceptor (Adds the JWT token to every request)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add this below your Request Interceptor in api.js

// 4. The Response Interceptor (Handles errors globally)
API.interceptors.response.use(
  (response) => {
      // If the request was successful, just return the response
      return response;
  },
  (error) => {
      // If the server returns a 401, maybe the token expired?
      if (error.response?.status === 401) {
          console.error("Unauthorized! Logging out...");
          // Optional: localStorage.removeItem("token");
          // Optional: window.location.href = "/login";
      }
      return Promise.reject(error);
  }
);

// ------------------- USERS & PROFILE -------------------
export const fetchUsers = () => API.get("/users");
// ------------------- AUTH (Updated to match your authRoutes.js) -------------------
// Change "/users/register" to "/auth/register"
export const registerUser = (userData) => API.post("/auth/register", userData);
// Add this to your existing exports in api.js
export const verifyEmail = async (data) => {
    // data should contain { email, otp }
    return await API.post("/auth/verify-email", data);
  };

// Change "/users/login" to "/auth/login"
export const loginUser = (userData) => API.post("/auth/login", userData);

// Add this to match the new /me route we created
export const getMe = () => API.get("/auth/me");

// Fetches the logged-in user's detailed data
export const getUserProfile = () => API.get("/users/profile");

// Handles the "Save Changes" functionality for the profile
export const updateProfile = (profileData) => API.put("/users/profile/update", profileData);

// ------------------- JOBS -------------------
export const fetchJobs = (params) => API.get("/jobs", { params });
export const fetchJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (jobData) => API.post("/jobs", jobData);
export const fetchMyJobs = () => API.get("/jobs/my-jobs");
// Add this to your existing exports in src/api/api.js
export const fetchProposalsByJob = (jobId) => API.get(`/proposals/job/${jobId}`);
// frontend/src/api/api.js
export const fetchSavedJobs = () => API.get("/jobs/saved/all");
// Add this to your other exports in api.js
export const toggleSaveJob = (jobId) => API.post('/jobs/save', { job_id: jobId });
// Add this near your other Job exports
export const fetchRecommendedJobs = () => API.get("/jobs/recommended/personal");

// Also, add the hiring call if you haven't yet:
export const hireFreelancer = (hireData) => API.post("/contracts/hire", hireData);
export const fetchContractById = (id) => API.get(`/contracts/${id}`);
export const submitWork = (id, data) => API.put(`/contracts/${id}/submit`, data);
// Add this to your API.js
export const approveWorkAndReleasePayment = (contractId) => API.put(`/contracts/${contractId}/approve`);
export const fetchUserContracts = () => API.get("/contracts/user/all");

export const fetchCategoryStats = () => API.get("/jobs/stats/categories");



// ------------------- PROPOSALS -------------------
export const submitProposal = (proposalData) => API.post("/proposals", proposalData);
export const fetchClientProposals = () => API.get("/proposals/client");


// ------------------- PAYMENTS -------------------
export const initializePayment = (paymentData) => API.post("/payments/init", paymentData);
export const verifyPayment = (reference) => API.get(`/payments/verify/${reference}`);

export const getPublicProfile = (id) => API.get(`/users/public/${id}`);

export default API;