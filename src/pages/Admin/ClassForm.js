import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import studentApi from '../../api/studentApi';

import { FiBook, FiUserPlus, FiUsers, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';

export default function ClassForm() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    students: true,
    submitting: false
  }) 
  const [formData, setFormData] = useState({
    className: '',
    courseID: '',
    startDate: '',
    endDate: '',
    description: '',
    studentIds: []
  });

  // Fetch danh sách học phần và học sinh khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          adminApi.getAllSubject(),
          studentApi.getAllStudent()
        ]);
        
        setCourses(coursesRes.data);
        setAvailableStudents(studentsRes.data);
        setLoading(prev => ({ ...prev, courses: false, students: false }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(prev => ({ ...prev, courses: false, students: false }));
      }
    };
    
    fetchData();
  }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Thêm học sinh vào lớp
  const addStudent = (student) => {
    if (!formData.studentIds.includes(student.studentID)) {
      setFormData(prev => ({
        ...prev,
        studentIds: [...prev.studentIds, student.studentID]
      }));
      
      setStudents(prev => [...prev, student]);
      setAvailableStudents(prev => prev.filter(s => s.studentID !== student.studentID));
    }
  };

  // Xóa học sinh khỏi lớp
  const removeStudent = (student) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.filter(id => id !== student.studentID)
    }));
    
    setStudents(prev => prev.filter(s => s.studentID !== student.studentID));
    setAvailableStudents(prev => [...prev, student]);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));

    try {
      // 1. Create class
      const classData = {
        subjectID: formData.courseID,
        className: formData.className,
        teacherID: 1,
        subjectName: courses.find(c => c.subjectID === formData.courseID)?.subjectName || '',
        createdAt: new Date().toISOString()
      };
      
      const createdClass = await adminApi.createClass(classData);
      console.log("[DEBUG] createClass response:", createdClass);
      console.log("[DEBUG] classID extracted:", createdClass.data?.classID);
      const classId = createdClass.data?.classID;

      // 2. Add students to class
      const studentPromises = formData.studentIds.map(studentId => {
        const studentData = {
          classID: classId,
          studentID: studentId,
          enrollmentDate: new Date().toISOString()
        };
        return adminApi.addStudentToClass(studentData);
      });
      await Promise.all(studentPromises);

      // 3. Clone lessons from subject
      await adminApi.cloneLesons(classId, formData.courseID);

      navigate('/admin/classes', { state: { success: 'Lớp học đã được tạo thành công!' } });
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Có lỗi xảy ra khi tạo lớp học');
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (loading.courses || loading.students) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Tạo Lớp Học Phần Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Thông tin cơ bản */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin lớp học</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên lớp học</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Học phần</label>
              <select
                name="courseID"
                value={formData.courseID}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn học phần</option>
                {courses.map(subject => (
                  <option key={subject.subjectID} value={subject.subjectID}>
                    {subject.subjectName} ({subject.subjectID})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Thêm học sinh */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Danh sách học sinh</h2>
          
          {/* Học sinh đã thêm */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <FiUsers className="mr-1" /> Học sinh trong lớp ({students.length})
              </h3>
            </div>
            
            {students.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map(student => (
                  <div key={student.studentID} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-500">{student.studentCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStudent(student)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-2">Chưa có học sinh nào được thêm vào lớp</p>
            )}
          </div>

          {/* Thêm học sinh mới */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiUserPlus className="mr-1" /> Thêm học sinh
            </h3>
            
            {availableStudents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableStudents.map(student => (
                  <div key={student.studentID} className="flex items-center justify-between bg-white border p-3 rounded-md">
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-sm text-gray-500">{student.studentCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addStudent(student)}
                      className="text-green-500 hover:text-green-700 p-1"
                    >
                      <FiCheck />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-2">Tất cả học sinh đã được thêm vào lớp</p>
            )}
          </div>
        </div>

        {/* Nút submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading.submitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            {loading.submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo...
              </>
            ) : (
              'Tạo lớp học'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}