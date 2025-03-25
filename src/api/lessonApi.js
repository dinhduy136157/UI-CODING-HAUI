import axiosClient from "./axiosClient";

const lessonApi = {
  // Lấy thông tin bài học dựa vào lớp
  getDataLesson: (classId) => {
    return axiosClient.get(`Lesson/class-lessons?classId=${classId}`);
  },
  getDataLessonDetail: (lessonId) => {
    return axiosClient.get(`LessonContent/lesson-detail?lessonId=${lessonId}`);
  },
};

export default lessonApi;
