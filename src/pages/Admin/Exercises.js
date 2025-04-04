import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPlus, FaCode, FaListAlt, FaEdit, FaTrash } from 'react-icons/fa';
import adminApi from '../../api/adminApi';

export default function Exercises() {
  const { lessonId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await adminApi.getExercisesByLesson(lessonId);
        setExercises(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [lessonId]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa bài tập này?')) {
      try {
        await adminApi.deleteExercise(id);
        setExercises(exercises.filter(ex => ex.exerciseID !== id));
      } catch (err) {
        console.error('Error deleting exercise:', err);
        alert('Xóa bài tập thất bại');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
        Lỗi khi tải danh sách bài tập: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài tập</h1>
          <p className="text-gray-600">Lesson ID: {lessonId}</p>
        </div>
        <Link 
          to={`/admin/lessons/${lessonId}/exercises/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Tạo bài tập mới
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          Chưa có bài tập nào trong bài học này
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaCode className="inline mr-1" /> Tên bài tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaListAlt className="inline mr-1" /> Test Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((exercise) => (
                <tr key={exercise.exerciseID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {exercise.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {exercise.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {exercise.testCases ? exercise.testCases.length : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(exercise.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <Link
                        to={`/admin/lessons/${lessonId}/exercises/${exercise.exerciseID}/submissions`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Xem bài nộp"
                      >
                        <FaListAlt className="text-lg" />
                      </Link>
                      <Link
                        to={`/admin/lessons/${lessonId}/exercises/${exercise.exerciseID}/edit`}
                        className="text-green-500 hover:text-green-700"
                        title="Sửa bài tập"
                      >
                        <FaEdit className="text-lg" />
                      </Link>
                      <button
                        onClick={() => handleDelete(exercise.exerciseID)}
                        className="text-red-500 hover:text-red-700"
                        title="Xóa bài tập"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}