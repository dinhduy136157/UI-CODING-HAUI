import axiosClient from "./axiosClient";

const codingExerciseApi = {
  // Lấy thông bafi code dựa vào bai hoc
  getCodingExercise: (lessonId) => {
    return axiosClient.get(`CodingExercise/coding-exercise?lessonId=${lessonId}`);
  },
  getCodingExerciseDetail: (exerciseId) => {
    return axiosClient.get(`CodingExercise/coding-exercise-detail/${exerciseId}`);
  },
  submitCode: (data) => {
    return axiosClient.post(`/Submission/submissions`, {
      studentID: data.studentId,
      exerciseID: data.exerciseId,
      code: data.code,
      programmingLanguage: data.language,
      status: "Đang kiểm tra",
      result: "Chưa có kq",
      score: 0,
      executionTime: 0,
      memoryUsage: 0,
      testCasesPassed: 0,
      totalTestCases: 0
      // Các trường khác theo API của bạn
    });
  }
};

export default codingExerciseApi;