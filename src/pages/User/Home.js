import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import studentApi from "../../api/studentApi";
import codingExerciseApi from "../../api/codingExerciseApi";


export default function Home() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bạn có một thông báo mới", read: false },
  ]);
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin user
  const [classes, setClasses] = useState([]); // Thêm state lưu danh sách lớp học
  const [classDetails, setClassDetails] = useState({});
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
        
        // Fetch exercises and submissions for each class
        const details = {};
        for (const classItem of response.data) {
          try {
            const [exercisesRes, submissionsRes] = await Promise.all([
              codingExerciseApi.getCodingExerciseByClassId(classItem.classID),
              studentApi.getSubmissionByStudentIdAndClassId(user.studentID, classItem.classID)
            ]);
            
            const totalExercises = exercisesRes.data.length;
            const completedExercises = new Set(
              submissionsRes.data
                .filter(sub => sub.status === "Accepted")
                .map(sub => sub.exerciseID)
            ).size;

            details[classItem.classID] = {
              totalExercises,
              completedExercises
            };
          } catch (error) {
            console.error(`Error fetching details for class ${classItem.classID}:`, error);
            details[classItem.classID] = {
              totalExercises: 0,
              completedExercises: 0
            };
          }
        }
        setClassDetails(details);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp học:", error);
      }
    };

    // Chỉ fetch classes khi đã có thông tin user
    if (user) {
      fetchClasses();
    }
  }, [user]); // Thêm user vào dependency array

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
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Tổng quan các lớp học phần</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((course, index) => (
              <motion.div
                key={course.classID}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl shadow-lg text-white relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                style={{
                  background: [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
                    'linear-gradient(135deg, #FF6B6B 0%, #FF0000 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)'
                  ][index % 8]
                }}
                onClick={() => navigate(`/Lesson?classId=${course.classID}`)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">{course.subjectName}</h3>
                  <p className="text-sm opacity-90">Mã lớp: {course.className}</p>
                  <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-90">Số bài tập</span>
                      <span className="text-sm font-semibold">{classDetails[course.classID]?.totalExercises || 0}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm opacity-90">Đã hoàn thành</span>
                      <span className="text-sm font-semibold">{classDetails[course.classID]?.completedExercises || 0}</span>
                    </div>
                  </div>
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
