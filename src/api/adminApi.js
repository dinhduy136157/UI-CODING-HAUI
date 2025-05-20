import axiosClient from "./axiosClient";
// Lấy thông tin user
const adminApi = {
  
    // Lấy thông tin user
    getStudentByClass: (classId) => axiosClient.get(`/ClassStudent/getStudentByClassId?classId=${classId}`),
    addStudentToClass: (data) => axiosClient.post('/ClassStudent', data),

      // Exercises
    getAllExercise: () => axiosClient.get(`/CodingExercise`),

    getExercisesByLesson: (lessonId) => axiosClient.get(`/CodingExercise/coding-exercise?lessonId=${lessonId}`),
    getExercise: (exerciseId) => axiosClient.get(`/CodingExercise/${exerciseId}`),
    createExercise: (data) => axiosClient.post('/CodingExercise', data),
    updateExercise: (id, data) => axiosClient.put(`/CodingExercise/${id}`, data),
    deleteExercise: (id) => axiosClient.delete(`/CodingExercise/${id}`),

    // TestCases
    getTestCaseByExercise: (exerciseId) => axiosClient.get(`/TestCase/GetTestCaseByExercise/${exerciseId}`),
    createTestCase: (data) => axiosClient.post('/TestCase', data),
    updateTestCase: (id, data) => axiosClient.put(`/TestCase/${id}`, data),
    deleteTestCase: (id) => axiosClient.delete(`/TestCase/${id}`),

    // Submissions
    getAllSubmissions: () => axiosClient.get(`/Submission`),
    getSubmissions: (exerciseId) => axiosClient.get(`/CodingExercise/${exerciseId}/submissions`),
    updateSubmission: (submissionId, data) => axiosClient.patch(`/submission/${submissionId}`, data),
    // Subject
    getAllSubject: () => axiosClient.get(`/Subject`),
    getSubjectDetail: (id) => axiosClient.get(`/subject/${id}`),


    // Lớp học
    getClasses: () => axiosClient.get('/class/getClassByTeacherId?teacherId=1'),
    getClassDetail: (id) => axiosClient.get(`/class/${id}`),
    createClass: (data) => axiosClient.post('/Class', data),
    // Bài học
    getLessons: (classId) => axiosClient.get(`/Lesson/class-lessons?classId=${classId}`),
    createLesson: (classId, data) => axiosClient.post(`/classes/${classId}/lessons`, data),
    getLessonsBySubjectId: (subjectId) => axiosClient.get(`/Lesson/lessons-by-subjectid?subjectId=${subjectId}`),
    cloneLesons: (classId, subjectId) => axiosClient.post(`/Lesson/clone-lessons?targetClassId=${classId}&subjectId=${subjectId}`),

    // Nội dung bài học
    getContents: (lessonId) => axiosClient.get(`/LessonContent/lesson-detail?lessonId=${lessonId}`),



    uploadContent: (formData) => axiosClient.post(`/LessonContent/upload`, formData, {
      transformRequest: (data, headers) => {
        // Xóa header Content-Type để trình duyệt tự động thêm boundary
        delete headers['Content-Type'];
        return data;
      }
    }),



    deleteContent: (contentId) => axiosClient.delete(`/LessonContent/${contentId}`),
    getDataTeacher: () => {
      return axiosClient.get("/teacher/me");
    },
};
  
  export default adminApi;