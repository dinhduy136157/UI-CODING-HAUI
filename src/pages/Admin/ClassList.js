import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiArrowRight, FiCalendar } from 'react-icons/fi';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await adminApi.getClasses();
        setClasses(res.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
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
        <h1 className="text-2xl font-bold text-gray-800">Danh sách Lớp học</h1>
        <Link 
          to="/admin/classes/new" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <FiBook className="text-lg" />
          Tạo lớp mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(c => (
          <div 
            key={c.classID} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{c.className}</h3>
                  <p className="text-gray-600 mt-1">{c.subjectName}</p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {c.subjectID}
                </span>
              </div>

              <div className="mt-6 flex justify-between space-x-3">
                <Link
                  to={`/admin/classes/${c.classID}/students`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                >
                  <FiUsers />
                  <span>Học sinh</span>
                </Link>
                <Link
                  to={`/admin/classes/${c.classID}/lessons`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100"
                >
                  <FiBook />
                  <span>Bài học</span>
                </Link>
              </div>

              <Link
                to={`/admin/classes/${c.classID}`}
                className="mt-4 w-full flex items-center justify-center gap-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                Xem chi tiết <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có lớp học nào được tạo</p>
          <Link 
            to="/admin/classes/new" 
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tạo lớp đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}