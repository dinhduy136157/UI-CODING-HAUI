import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import { FaFile, FaTags, FaFilePdf } from "react-icons/fa";
import lessonApi from "../../api/lessonApi";
import { useSearchParams } from "react-router-dom";

export default function Lesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const [selectedTab, setSelectedTab] = useState("course");
  const [lessons, setLessons] = useState([]);
  const [lessonContents, setLessonContents] = useState({}); 
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;
      
      try {
        // 1. Fetch danh sách lessons
        const lessonResponse = await lessonApi.getDataLesson(classId);
        setLessons(lessonResponse.data);
        
        // 2. Fetch nội dung cho từng lesson
        const contents = {};
        for (const lesson of lessonResponse.data) {
          const contentResponse = await lessonApi.getDataLessonDetail(lesson.lessonID);
          contents[lesson.lessonID] = contentResponse.data;
        }
        setLessonContents(contents);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [classId]);

  // Lấy danh sách file PDF từ lessonContent
  const getPdfFiles = (lessonId) => {
    if (!lessonContents[lessonId]) return [];
    return lessonContents[lessonId]
      .filter(content => content.contentType === "PDF")
      .map(content => ({
        name: content.fileUrl,
        title: content.title || content.fileUrl
      }));
  };

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
            {lessons.map((lesson) => {
              const pdfFiles = getPdfFiles(lesson.lessonID);
              const hasPdfFiles = pdfFiles.length > 0;

              return (
                <motion.div
                  key={lesson.lessonID}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-md shadow bg-white cursor-pointer"
                  onClick={() => navigate(`/LessonDetail?lessonId=${lesson.lessonID}`)}
                >
                  {/* Tiêu đề bài học */}
                  <h3 className="font-semibold text-lg mb-2">{lesson.lessonTitle}</h3>

                  {/* Quá trình hoàn thành (nếu có) */}
                  {/* {lesson.progess && (
                    <p className="text-sm text-gray-500 mb-2">
                      Quá trình: {lesson.progess}
                    </p>
                  )} */}

                  {/* Các nhãn (nếu có) */}
                  {lesson.label && (
                    <div className="flex items-center gap-2 mb-2">
                      <FaTags className="text-gray-500" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {lesson.label}
                      </span>
                    </div>
                  )}

                  {/* File đính kèm PDF */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaFilePdf className="text-red-500" />
                      <span>Tài liệu PDF:</span>
                    </div>
                    <div className="pl-6 mt-1 space-y-1">
                      {hasPdfFiles ? (
                        pdfFiles.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Mở file PDF khi click
                              window.open(`${API_BASE_URL}/uploads/pdfs/${file.name}`);
                            }}
                          >
                            <span className="text-gray-500">•</span>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                              {file.title}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">Không có tài liệu PDF</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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