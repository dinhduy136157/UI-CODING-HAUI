import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import codingExerciseApi from '../../api/codingExerciseApi';
import studentApi from '../../api/studentApi';
import { 
  FiUser, FiMail, FiPhone, FiCalendar, 
  FiAward, FiCreditCard, FiChevronDown, FiChevronUp,
  FiCode, FiClock, FiCheckCircle, FiXCircle,
  FiSearch
} from 'react-icons/fi';

export default function Students() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students and exercises in parallel
        const [studentsResponse, exercisesResponse] = await Promise.all([
          adminApi.getStudentByClass(classId),
          codingExerciseApi.getCodingExerciseByClassId(classId)
        ]);

        // Fetch submissions for each student
        const studentsWithProgress = await Promise.all(
          studentsResponse.data.map(async (student) => {
            try {
              const submissionsResponse = await studentApi.getSubmissionByStudentIdAndClassId(student.studentID, classId);
              
              // Tính số bài đã hoàn thành (có ít nhất 1 submission Accepted)
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
        setFilteredStudents(studentsWithProgress);
        setLoading(false);

        // Fetch và lưu submissions mới nhất để hiển thị chi tiết
        fetchLatestSubmissions(studentsResponse.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // Thêm useEffect để lọc học sinh khi searchQuery thay đổi
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = students.filter(student => {
      const fullName = (student.fullName || `${student.lastName} ${student.firstName}`).toLowerCase();
      const studentCode = (student.studentCode || '').toLowerCase();
      const phone = (student.phone || '').toLowerCase();

      return fullName.includes(query) || 
             studentCode.includes(query) || 
             phone.includes(query);
    });

    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const fetchLatestSubmissions = async (students) => {
    const submissionsMap = {};
    
    for (const student of students) {
      try {
        const response = await studentApi.getSubmissionByStudentIdAndClassId(student.studentID, classId);
        submissionsMap[student.studentID] = getLatestSubmissions(response.data);
      } catch (err) {
        console.error(`Error fetching submissions for student ${student.studentID}:`, err);
        submissionsMap[student.studentID] = {};
      }
    }
    
    setStudentSubmissions(submissionsMap);
  };

  // Lấy submission mới nhất cho mỗi bài tập (chỉ để hiển thị)
  const getLatestSubmissions = (submissions) => {
    const latest = {};
    
    submissions.forEach(sub => {
      if (!latest[sub.exerciseID] || 
          new Date(sub.submittedAt) > new Date(latest[sub.exerciseID].submittedAt)) {
        latest[sub.exerciseID] = sub;
      }
    });
    
    return latest;
  };

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getExerciseTitle = (exerciseId) => {
    const exercise = exercises.find(ex => ex.exerciseID === exerciseId);
    return exercise ? exercise.title : `Bài tập #${exerciseId}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <FiCheckCircle className="text-green-500 inline mr-1" />;
      case "Pending":
        return <FiClock className="text-yellow-500 inline mr-1" />;
      default:
        return <FiXCircle className="text-red-500 inline mr-1" />;
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
        Lỗi khi tải danh sách học sinh: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách học sinh</h1>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Tìm kiếm học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-gray-500">
            Lớp: <span className="font-medium">{classId}</span>
            {exercises.length > 0 && (
              <span className="ml-4">
                Tổng bài tập: <span className="font-medium">{exercises.length}</span>
              </span>
            )}
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleStudentExpansion(student.studentID)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        {expandedStudent === student.studentID ? (
                          <>
                            <FiChevronUp className="mr-1" /> Thu gọn
                          </>
                        ) : (
                          <>
                            <FiChevronDown className="mr-1" /> Xem bài nộp
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedStudent === student.studentID && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <h3 className="font-medium text-lg mb-4 flex items-center">
                            <FiCode className="mr-2" /> Bài tập đã nộp
                          </h3>
                          
                          {studentSubmissions[student.studentID] && Object.keys(studentSubmissions[student.studentID]).length > 0 ? (
                            <div className="space-y-4">
                              {Object.values(studentSubmissions[student.studentID]).map(sub => (
                                <div key={sub.submissionID} className="border-b pb-4 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">{getExerciseTitle(sub.exerciseID)}</h4>
                                      <div className="text-sm text-gray-500 mt-1">
                                        <span className="flex items-center">
                                          {getStatusIcon(sub.status)}
                                          {sub.status} • 
                                          Điểm: {sub.score} • 
                                          Nộp lúc: {new Date(sub.submittedAt).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button 
                                        onClick={() => navigate(`/admin/submissions/${sub.submissionID}`)}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Xem chi tiết
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center py-4">
                              Sinh viên chưa nộp bài tập nào
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}