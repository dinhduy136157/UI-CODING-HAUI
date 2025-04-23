import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import studentApi from "../../api/studentApi";
import { FaClipboardList } from "react-icons/fa";

export default function ScoreOverview() {
  const [selectedTab, setSelectedTab] = useState("scores");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bạn có một thông báo mới", read: false },
  ]);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, coursesRes] = await Promise.all([
          studentApi.getDataStudent(),
          studentApi.getDataStudentFollowClass()
        ]);
        setUser(userRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
  };

  if (loading) return <div className="flex min-h-screen bg-gray-100">
    <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    <main className="flex-1 p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </main>
  </div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <main className="flex-1 p-6">
        <Header notifications={notifications} markNotificationAsRead={markNotificationAsRead} />
        
        <section className="mt-6">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-blue-500 mr-2 text-xl" />
            <h2 className="text-xl font-semibold">Kết quả học tập</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Sinh viên: {user?.fullName}</h3>
              <p className="text-gray-600">Mã SV: {user?.studentCode}</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học phần</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm TK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xem chi tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.courseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.subjectName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          course.finalScore >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {course.finalScore || 'Chưa có'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => navigate(`/ScoreDetail/${course.classID}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 Hệ thống quản lý học tập
        </footer>
      </main>
    </div>
  );
}