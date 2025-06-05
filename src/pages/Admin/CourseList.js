import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { useState, useEffect } from 'react';
import { FiBook, FiArrowRight, FiCalendar, FiFileText, FiLayers } from 'react-icons/fi';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await adminApi.getAllSubject();
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách Học phần</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div 
            key={course.subjectID} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{course.subjectID}</h3>
                  <p className="text-gray-600 mt-1">{course.subjectName}</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <FiCalendar className="mr-1" />
                      18/5/2025
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {course.courseCode}
                </span>
              </div>

              <div className="mt-6 flex justify-between space-x-3">
                <Link
                  to={`/admin/courses/${course.subjectID}/lessons`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100"
                >
                  <FiLayers />
                  <span>Bài học học phần</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}