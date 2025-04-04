import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import studentApi from "../../api/studentApi";


export default function Home() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bạn có một thông báo mới", read: false },
  ]);
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin user
  const [classes, setClasses] = useState([]); // Thêm state lưu danh sách lớp học
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Gọi API lấy thông tin user khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await studentApi.getDataStudent();
        setUser(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await studentApi.getDataStudentFollowClass();
        setClasses(response.data); 
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học:", error);
      }
    };

    fetchClasses();
  }, []);
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <Header notifications={notifications} markNotificationAsRead={markNotificationAsRead} />

        {/* Course Overview */}
        {/* Course Overview */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Tổng quan các lớp học phần</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((course, index) => (
              <motion.div
                key={course.classID}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-md shadow text-white relative overflow-hidden"
                style={{
                  backgroundImage: `url(${[
                    "https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Course",
                    "https://via.placeholder.com/300x200/3357FF/FFFFFF?text=Course",
                  ][index % 4]
                    })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => navigate(`/Lesson?classId=${course.classID}`)}
                
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold">{course.subjectName}</h3>
                  <p className="text-xs">Mã lớp: {course.className}</p>
                  <p className="text-xs">Hoàn thành {index % 2 === 0 ? "0%" : "100%"}</p>

                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 Hệ thống quản lý học tập. Được phát triển bởi Đinh Văn Duy.
        </footer>
      </main>
    </div>
  );
}
