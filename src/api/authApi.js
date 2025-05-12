import axiosClient from "./axiosClient";

const authApi = {
  // Đăng nhập
  login: (studentCode, password) => {
    return axiosClient.post("/StudentAuth/login", {
      studentCode: studentCode,
      password: password,
    });
  },
  loginTeacher: (email, password) => {
    return axiosClient.post("/TeacherAuth/login", {
      email: email,
      password: password,
    });
  },

  // Lấy thông tin user
  getDataStudent: () => {
    return axiosClient.get("/student/me");
  },
  getDataTeacher: () => {
    return axiosClient.get("/teacher/me");
  },
  
  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authApi;
