import axiosClient from "./axiosClient";

const codingExerciseApi = {
  // Lấy thông bafi code dựa vào bai hoc
  getCodingExercise: (lessonId) => {
    return axiosClient.get(`CodingExercise/coding-exercise?lessonId=${lessonId}`);
  },
  getCodingExerciseDetail: (exerciseId) => {
    return axiosClient.get(`CodingExercise/coding-exercise-detail/${exerciseId}`);
  },
};

export default codingExerciseApi;