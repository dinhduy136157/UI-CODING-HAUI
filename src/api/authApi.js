import axiosClient from "./axiosClient";

const authApi = {
  // Đăng nhập
  login: (studentCode, password) => {
    return axiosClient.post("/StudentAuth/login", {
      studentCode: studentCode,
      password: password,
    });
  },

  // Lấy thông tin user
  getDataStudent: () => {
    return axiosClient.get("/student/me");
  },
  
  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authApi;
