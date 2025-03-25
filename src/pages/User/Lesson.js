import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import { FaFile, FaTags } from "react-icons/fa";
import lessonApi from "../../api/lessonApi"; // Import API
import { useSearchParams } from "react-router-dom";


export default function Lesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId"); // Lấy classId từ URL

  const [selectedTab, setSelectedTab] = useState("course");
  const [lessons, setLessons] = useState([]); // State để lưu danh sách bài học

  
  // Gọi API lấy danh sách bài học
  useEffect(() => {
    const fetchLessons = async () => {
      if (!classId) return; // Nếu không có classId thì không gọi API
      try {
        const response = await lessonApi.getDataLesson(classId); // Gọi API
        setLessons(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài học:", error);
      }
    };
    fetchLessons();
  }, [classId]); // Chạy lại khi classId thay đổi
  

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <Header />

        {/* Course Content */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách bài học</h2>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson.lessonID}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-md shadow bg-white cursor-pointer"
                onClick={() => navigate(`/LessonDetail?lessonId=${lesson.lessonID}`)} // Truyền lessonID khi chuyển trang
              >
                {/* Tiêu đề bài học */}
                <h3 className="font-semibold text-lg mb-2">{lesson.lessonTitle}</h3>

                {/* Quá trình hoàn thành */}
                <p className="text-sm text-gray-500 mb-2">
                  Quá trình: {lesson.progess}
                </p>

                {/* Các nhãn */}
                <div className="flex items-center gap-2 mb-2">
                  <FaTags className="text-gray-500" />
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {lesson.label}
                  </span>
                </div>

                {/* File đính kèm */}
                <div className="flex items-center gap-2">
                  <FaFile className="text-gray-500" />
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {lesson.files}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 Hệ thống quản lý học tập. Phát triển bởi Đinh Văn Duy.
        </footer>
      </main>
    </div>
  );
}
