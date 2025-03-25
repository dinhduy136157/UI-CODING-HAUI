import axiosClient from "./axiosClient";

const codingExerciseApi = {
  // Lấy thông bafi code dựa vào bai hoc
  getCodingExercise: (classId) => {
    return axiosClient.get(`CodingExercise/coding-exercise?lessonId=${classId}`);
  },
};

export default codingExerciseApi;