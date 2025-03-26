import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilePdf, FaCode, FaCheck, FaPlay } from "react-icons/fa";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import lessonApi from "../../api/lessonApi";
import codingExerciseApi from "../../api/codingExerciseApi";

export default function LessonDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = searchParams.get("lessonId");
  const [lessonData, setLessonData] = useState([]);
  const [codingExercises, setCodingExercises] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all lesson data
  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      
      try {
        setLoading(true);
        const [lessonRes, codingRes] = await Promise.all([
          lessonApi.getDataLessonDetail(lessonId),
          codingExerciseApi.getCodingExercise(lessonId)
        ]);
        
        setLessonData(lessonRes.data);
        setCodingExercises(codingRes.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  const toggleCompletion = (activityId) => {
    setCompletedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId) 
        : [...prev, activityId]
    );
  };

  const handleStartCoding = (exerciseId) => {
    navigate(`/CodingExercise?exerciseId=${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <div className="text-center mt-10 text-lg">
            Đang tải dữ liệu bài học...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <div className="text-center mt-10 text-lg text-red-500">
            Lỗi: {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <Header />
        
        {/* Theory Section */}
        <div className="p-6 bg-white rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            Bài {lessonId}: Nội dung lý thuyết
          </h2>

          {["Hoạt động trước khi lên lớp", "Hoạt động trên lớp", "Hoạt động sau khi lên lớp"].map(
            (category) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  {category}
                </h3>
                <div className="space-y-3">
                  {lessonData
                    .filter((act) => act.category === category)
                    .map((activity) => (
                      <motion.div
                        key={activity.contentID}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FaFilePdf className="text-red-500 min-w-[20px]" />
                          <a
                            href={activity.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                            title={activity.title}
                          >
                            {activity.title}
                          </a>
                        </div>
                        <input
                          type="checkbox"
                          checked={completedActivities.includes(activity.contentID)}
                          onChange={() => toggleCompletion(activity.contentID)}
                          className="w-5 h-5 cursor-pointer accent-blue-600"
                        />
                      </motion.div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Coding Exercises Section */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            Bài tập thực hành
          </h2>

          {codingExercises.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {codingExercises.map((exercise) => (
                <motion.div
                  key={exercise.exerciseID}
                  whileHover={{ y: -2 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => handleStartCoding(exercise.exerciseID)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FaCode className="text-blue-500 text-lg" />
                      <h3 className="font-semibold text-lg">{exercise.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{exercise.description}</p>
                    <div className="bg-gray-100 p-3 rounded mb-3">
                      <p className="text-sm font-medium">Ví dụ:</p>
                      <p className="text-sm">Input: {exercise.exampleInput}</p>
                      <p className="text-sm">Output: {exercise.exampleOutput}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCoding(exercise.exerciseID);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <FaPlay size={12} />
                      Bắt đầu làm bài
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có bài tập lập trình nào cho bài học này
            </div>
          )}
        </div>
      </main>
    </div>
  );
}