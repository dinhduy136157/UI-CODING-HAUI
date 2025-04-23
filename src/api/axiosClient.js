import axios from "axios";

// Base URL của API
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

// Tạo instance Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token vào request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
