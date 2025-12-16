import axios from "axios";

const backEndUrl = "https://whatsapp-mern-backend-sidn.onrender.com/api/";

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
