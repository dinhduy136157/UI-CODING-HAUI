import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFilePdf, FaCode, FaCheck, FaPlay, FaCheckCircle, FaTimesCircle, FaRegClock, FaChartLine, FaBookOpen, FaChalkboardTeacher, FaClipboardCheck
} from "react-icons/fa";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import lessonApi from "../../api/lessonApi";
import codingExerciseApi from "../../api/codingExerciseApi";
import studentApi from "../../api/studentApi";

export default function LessonDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = searchParams.get("lessonId");
  const [lessonData, setLessonData] = useState([]);
  const [codingExercises, setCodingExercises] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;

      try {
        setLoading(true);

        const userResponse = await studentApi.getDataStudent();
        setUser(userResponse.data);

        const [lessonRes, codingRes, submissionsRes] = await Promise.all([
          lessonApi.getDataLessonDetail(lessonId),
          codingExerciseApi.getCodingExercise(lessonId),
          studentApi.getSubmissionByStudentIdAndLessonId(userResponse.data.studentID, lessonId)
        ]);

        setLessonData(lessonRes.data);
        setCodingExercises(codingRes.data || []);
        setSubmissions(submissionsRes.data || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  const getLatestSubmissionForExercise = (exerciseId) => {
    const exerciseSubmissions = submissions
      .filter(s => s.exerciseID === exerciseId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return exerciseSubmissions[0];
  };

  const getExerciseStatus = (exerciseId) => {
    const submission = getLatestSubmissionForExercise(exerciseId);

    if (!submission) {
      return {
        text: "Chưa làm",
        color: "bg-gray-100 text-gray-800",
        icon: <FaTimesCircle className="text-gray-500" />,
        score: null,
        badgeColor: "bg-gray-100 text-gray-800"
      };
    }

    if (submission.status === "Accepted") {
      return {
        text: "Hoàn thành",
        color: "bg-green-50 text-green-800",
        icon: <FaCheckCircle className="text-green-500" />,
        score: submission.score,
        badgeColor: submission.score >= 5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      };
    }

    if (submission.status === "Pending") {
      return {
        text: "Đang chấm",
        color: "bg-yellow-50 text-yellow-800",
        icon: <FaRegClock className="text-yellow-500" />,
        score: submission.score,
        badgeColor: "bg-yellow-100 text-yellow-800"
      };
    }

    return {
      text: "Chưa đạt",
      color: "bg-red-50 text-red-800",
      icon: <FaTimesCircle className="text-red-500" />,
      score: submission.score,
      badgeColor: "bg-red-100 text-red-800"
    };
  };
  const getIconForCategory = (category) => {
    switch (category) {
      case "Hoạt động trước khi lên lớp":
        return <FaBookOpen className="text-blue-600" />;
      case "Hoạt động trên lớp":
        return <FaChalkboardTeacher className="text-green-600" />;
      case "Hoạt động sau khi lên lớp":
        return <FaClipboardCheck className="text-purple-600" />;
      default:
        return null;
    }
  };

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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
              <div className="h-4 bg-blue-200 rounded w-32"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi khi tải dữ liệu
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <Header />

        {/* Theory Section */}
        <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Bài {lessonId}: Nội dung lý thuyết
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <FaChartLine className="mr-2" />
              <span>Tiến độ: {completedActivities.length}/{lessonData.length}</span>
            </div>
          </div>

          {["Hoạt động trước khi lên lớp", "Hoạt động trên lớp", "Hoạt động sau khi lên lớp"].map(
            (category) => (
              <div key={category} className="mb-10 last:mb-0">
                <div className="flex items-center mb-5">
                  <div className="w-1 h-8 bg-blue-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {getIconForCategory(category)}
                    {category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {lessonData
                    .filter((act) => act.category === category)
                    .map((activity) => (
                      <motion.div
                        key={activity.contentID}
                        whileHover={{ y: -2 }}
                        className={`flex items-center justify-between p-5 rounded-lg border transition-all ${completedActivities.includes(activity.contentID)
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:border-blue-200"
                          }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${completedActivities.includes(activity.contentID)
                              ? "bg-green-100"
                              : "bg-gray-100"
                            }`}>
                            <FaFilePdf className="text-lg text-red-500" />
                          </div>
                          <a
                            href={`${API_BASE_URL}/uploads/pdfs/${activity.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-blue-600 hover:underline font-medium truncate"
                            title={activity.title}
                          >
                            {activity.title}
                          </a>
                        </div>
                        <button
                          onClick={() => toggleCompletion(activity.contentID)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${completedActivities.includes(activity.contentID)
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                        >
                          <FaCheck className="text-xs" />
                        </button>
                      </motion.div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Coding Exercises Section */}
        <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Bài tập thực hành
            </h2>
            <div className="text-sm text-gray-500">
              {codingExercises.length} bài tập
            </div>
          </div>

          {codingExercises.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {codingExercises.map((exercise) => {
                const status = getExerciseStatus(exercise.exerciseID);
                const submission = getLatestSubmissionForExercise(exercise.exerciseID);

                return (
                  <motion.div
                    key={exercise.exerciseID}
                    whileHover={{ y: -5 }}
                    className={`rounded-xl border overflow-hidden transition-all ${status.color.split(' ')[0]}`}
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => handleStartCoding(exercise.exerciseID)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <FaCode className="text-lg" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded-full ${status.badgeColor}`}>
                            {status.text}
                          </span>
                          {status.score !== null && (
                            <span className={`text-xs mt-2 px-2 py-1 rounded-full font-medium ${status.badgeColor}`}>
                              Điểm: {status.score}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {exercise.description}
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Ví dụ:</p>
                        <div className="text-xs bg-white p-2 rounded">
                          <p className="font-mono">Input: {exercise.exampleInput}</p>
                          <p className="font-mono">Output: {exercise.exampleOutput}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-5 py-3 flex justify-between items-center ${status.color.split(' ')[0]}`}>
                      <div className="flex items-center gap-2">
                        {status.icon}
                        <span className="text-sm font-medium">
                          {status.text}
                          {submission && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCoding(exercise.exerciseID);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${status.text === "Hoàn thành"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >
                        <FaPlay size={10} />
                        <span className="text-sm">
                          {status.text === "Hoàn thành" ? "Làm lại" : "Bắt đầu"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaCode className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Chưa có bài tập thực hành
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Bài học này hiện chưa có bài tập lập trình nào. Vui lòng kiểm tra lại sau.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}