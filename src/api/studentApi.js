import axiosClient from "./axiosClient";
// Lấy thông tin user
const studentApi = {
  
    // Lấy thông tin user
    getDataStudent: () => {
      return axiosClient.get("/student/me");
    },
    
    //Thông tin học phần của học sinh

    getDataStudentFollowClass: () => {
      return axiosClient.get("/student/me/classes");
    },
    getSubmissionByStudentIdAndClassId: (studentId, classId) => {
      return axiosClient.get(`/Submission/students/${studentId}/classes/${classId}`);
    },
    getSubmissionByStudentIdAndLessonId: (studentId, lessonId) => {
      return axiosClient.get(`/Submission/students/${studentId}/lessons/${lessonId}`);
    },
  };

  
  export default studentApi;