import axiosClient from "./axiosClient";

const codingExerciseApi = {
  // Lấy thông bafi code dựa vào bai hoc
  getCodingExercise: (lessonId) => {
    return axiosClient.get(`CodingExercise/coding-exercise?lessonId=${lessonId}`);
  },
  getCodingExerciseDetail: (exerciseId) => {
    return axiosClient.get(`CodingExercise/coding-exercise-detail/${exerciseId}`);
  },
  getCodeTemplate: (exerciseId, lang) => {
    return axiosClient.get(`FunctionTemplate/${exerciseId}/${lang}`);
  },
  getCodingExerciseByClassId: (classId) => {
    return axiosClient.get(`CodingExercise/coding-exercise-classid/${classId}`);
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
  },
  submitFinalSolution: (data) => {
    return axiosClient.post(`/Submission/submissions`, {
      studentID: data.studentId,
      exerciseID: data.exerciseId,
      code: data.code,
      programmingLanguage: data.language,
      submittedAt: new Date().toISOString(), // ✅ Lấy thời gian hiện tại
      status: "Accepted",
      result: JSON.stringify(data.result), // ✅ Chuyển mảng kết quả thành JSON string
      score: data.score,
      executionTime: data.executionTime,
      memoryUsage: data.memoryUsage,
      testCasesPassed: data.testCasesPassed,
      totalTestCases: data.totalTestCases
    });
  }
};

export default codingExerciseApi;