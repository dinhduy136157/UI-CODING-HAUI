import axiosClient from "./axiosClient";
// Lấy thông tin user
const adminApi = {
  
    // Lấy thông tin user
    getStudentByClass: (classId) => axiosClient.get(`/ClassStudent/getStudentByClassId?classId=${classId}`),

      // Exercises
    getExercisesByLesson: (lessonId) => axiosClient.get(`/CodingExercise/coding-exercise?lessonId=${lessonId}`),
    createExercise: (data) => axiosClient.post('/CodingExercise', data),
    updateExercise: (id, data) => axiosClient.put(`/CodingExercise/${id}`, data),
    deleteExercise: (id) => axiosClient.delete(`/CodingExercise/${id}`),

    // Submissions
    getSubmissions: (exerciseId) => axiosClient.get(`/CodingExercise/${exerciseId}/submissions`),
    updateSubmission: (submissionId, data) => axiosClient.patch(`/submission/${submissionId}`, data),

      // Lớp học
    getClasses: () => axiosClient.get('/class/getClassByTeacherId?teacherId=1'),
    getClassDetail: (id) => axiosClient.get(`/class/${id}`),

    // Bài học
    getLessons: (classId) => axiosClient.get(`/Lesson/class-lessons?classId=${classId}`),
    createLesson: (classId, data) => axiosClient.post(`/classes/${classId}/lessons`, data),

    // Nội dung bài học
    getContents: (lessonId) => axiosClient.get(`/LessonContent/lesson-detail?lessonId=${lessonId}`),
    uploadContent: (lessonId, formData) => axiosClient.post(`/lessons/${lessonId}/contents`, formData),
  };
  
  export default adminApi;