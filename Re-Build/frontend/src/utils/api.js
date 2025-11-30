import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002",
  withCredentials: true, // Important for O-auth cookies
});

// Request Interceptors
api.interceptors.request.use(
  (config) => {
    // Add auth headers, log requests etc.
    console.log(` ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Res Interceptors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error.response?.data || error.message);
        return Promise.reject(error);
    }
)

export default api;