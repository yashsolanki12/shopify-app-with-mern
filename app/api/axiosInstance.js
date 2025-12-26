import axios from "axios";

// Dynamically set baseURL for local and production
let backEndUrl;
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  // Local development
  backEndUrl = "https://whatsapp-mern-backend-sidn.onrender.com/api/";
} else {
  // Production/Shopify live (proxy path)
  backEndUrl =
    "https://whatsapp-mern-backend-sidn.onrender.com/apps/whatsapp-mern-app/";
}

const axiosInstance = axios.create({
  baseURL: backEndUrl,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other custom headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
