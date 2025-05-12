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

// Xử lý response
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa token
      localStorage.removeItem("token");
      
      // Xác định loại user dựa vào URL hiện tại
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const loginPath = isAdminRoute ? '/admin/login' : '/login';
      
      // Chuyển hướng về trang login tương ứng
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
