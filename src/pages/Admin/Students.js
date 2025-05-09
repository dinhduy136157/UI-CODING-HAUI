import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import codingExerciseApi from '../../api/codingExerciseApi';
import studentApi from '../../api/studentApi';


import { FiUser, FiMail, FiPhone, FiCalendar, FiAward, FiCreditCard} from 'react-icons/fi';

export default function Students() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students and exercises in parallel
        const [studentsResponse, exercisesResponse] = await Promise.all([
          adminApi.getStudentByClass(classId),
          codingExerciseApi.getCodingExerciseByClassId(classId) // Giả sử có API này
        ]);

        // Fetch submissions for each student
        const studentsWithProgress = await Promise.all(
          studentsResponse.data.map(async (student) => {
            try {
              const submissionsResponse = await studentApi.getSubmissionByStudentIdAndClassId(student.studentID, classId);
              const acceptedExercises = new Set(
                submissionsResponse.data
                  .filter(sub => sub.status === "Accepted")
                  .map(sub => sub.exerciseID)
              );
              
              return {
                ...student,
                completedExercises: acceptedExercises.size,
                totalExercises: exercisesResponse.data.length
              };
            } catch (err) {
              console.error(`Error fetching submissions for student ${student.studentID}:`, err);
              return {
                ...student,
                completedExercises: 0,
                totalExercises: exercisesResponse.data.length
              };
            }
          })
        );

        setExercises(exercisesResponse.data);
        setStudents(studentsWithProgress);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

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
        Lỗi khi tải danh sách học sinh: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách học sinh</h1>
        <div className="text-gray-500">
          Lớp: <span className="font-medium">{classId}</span>
          {exercises.length > 0 && (
            <span className="ml-4">
              Tổng bài tập: <span className="font-medium">{exercises.length}</span>
            </span>
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Lớp học chưa có học sinh nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiCreditCard className="inline mr-1" /> Mã sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiUser className="inline mr-1" /> Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiPhone className="inline mr-1" /> Điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiCalendar className="inline mr-1" /> Ngày sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiAward className="inline mr-1" /> Bài tập
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.studentID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.studentCode || 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {student.fullName || `${student.lastName} ${student.firstName}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.phone || 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${student.totalExercises > 0 
                              ? (student.completedExercises / student.totalExercises) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {student.completedExercises}/{student.totalExercises}
                      </span>
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