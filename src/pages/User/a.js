import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";

export default function LessonDetail() {
  const { id } = useParams();
  const [completedActivities, setCompletedActivities] = useState([]);

  const lessonData = {
    title: `Lý thuyết - Bài ${id}: Tổng quan về cấu trúc dữ liệu và giải thuật`,
    activities: [
      {
        id: 1,
        title: "Bài 1 - Đề cương bài giảng",
        type: "pdf",
        category: "Hoạt động trước khi lên lớp",
        required: null,
      },
      {
        id: 2,
        title: "Bài 1 - Slide bài giảng",
        type: "pdf",
        category: "Hoạt động trên lớp",
        required: 1,
      },
      {
        id: 3,
        title: "Bài 1 - Phiếu giao bài tự luận",
        type: "pdf",
        category: "Hoạt động sau khi lên lớp",
        required: 1,
      },
    ],
  };

  const toggleCompletion = (activityId) => {
    if (completedActivities.includes(activityId)) {
      setCompletedActivities(completedActivities.filter((id) => id !== activityId));
    } else {
      setCompletedActivities([...completedActivities, activityId]);
    }
  };

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
          <h2 className="text-2xl font-semibold mb-6">{lessonData.title}</h2>

          {["Hoạt động trước khi lên lớp", "Hoạt động trên lớp", "Hoạt động sau khi lên lớp"].map(
            (category) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="space-y-4">
                  {lessonData.activities
                    .filter((act) => act.category === category)
                    .map((activity) => {
                      const isLocked =
                        activity.required && !completedActivities.includes(activity.required);

                      return (
                        <motion.div
                          key={activity.id}
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center justify-between p-4 border rounded-lg shadow transition-all ${isLocked
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white hover:shadow-md"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <FaFilePdf className={`text-lg ${isLocked ? "text-gray-400" : "text-red-500"}`} />
                            <span
                              className={`${isLocked ? "text-gray-400" : "text-blue-600 cursor-pointer"
                                }`}
                            >
                              {activity.title}
                            </span>
                          </div>
                          {isLocked ? (
                            <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">
                              Hạn chế
                            </span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={completedActivities.includes(activity.id)}
                              onChange={() => toggleCompletion(activity.id)}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
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