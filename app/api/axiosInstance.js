import axios from "axios";

// Detect if running in Shopify embedded app (inside iframe)
// const isEmbedded = () => {
//   if (typeof window === "undefined") return false;

//   // Check if we're in an iframe (Shopify embeds apps in iframes)
//   try {
//     return window.self !== window.top;
//   } catch (e) {
//     // If we can't access window.top due to cross-origin, we're likely embedded
//     return true;
//   }
// };

// Determine the correct base URL based on environment
const getBaseURL = () => {
  const backendDomain = "https://whatsapp-mern-backend-sidn.onrender.com";

  // Always use /api for consistency
  console.log("🟢 Using /api endpoint");
  return `${backendDomain}/api`;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
