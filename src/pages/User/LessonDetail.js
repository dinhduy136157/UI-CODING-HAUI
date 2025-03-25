import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Dùng useSearchParams thay vì useParams
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import lessonApi from "../../api/lessonApi"; // Import API

export default function LessonDetail() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId"); // Lấy lessonId từ URL
  const [lessonData, setLessonData] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);

  // Gọi API để lấy dữ liệu bài học
  useEffect(() => {
    const fetchLessonDetail = async () => {
      if (!lessonId) return; // Nếu không có lessonId thì không gọi API
      try {
        const response = await lessonApi.getDataLessonDetail(lessonId);
        setLessonData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài học:", error);
      }
    };

    fetchLessonDetail();
  }, [lessonId]);

  // Toggle hoàn thành bài học
  const toggleCompletion = (activityId) => {
    setCompletedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  if (!lessonId) {
    return <p className="text-center mt-10 text-lg text-red-500">Lỗi: Không tìm thấy lessonId trên URL</p>;
  }

  if (!lessonData.length) {
    return <p className="text-center mt-10 text-lg">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <Header />

        {/* Lesson Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Lý thuyết - Bài {lessonId}</h2>

          {["Hoạt động trước khi lên lớp", "Hoạt động trên lớp", "Hoạt động sau khi lên lớp"].map(
            (category) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="space-y-4">
                  {lessonData
                    .filter((act) => act.category === category)
                    .map((activity) => {
                      return (
                        <motion.div
                          key={activity.contentID}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 border rounded-lg shadow bg-white hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <FaFilePdf className="text-lg text-red-500" />
                            <a
                              href={activity.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 cursor-pointer"
                            >
                              {activity.title}
                            </a>
                          </div>
                          <input
                            type="checkbox"
                            checked={completedActivities.includes(activity.contentID)}
                            onChange={() => toggleCompletion(activity.contentID)}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
