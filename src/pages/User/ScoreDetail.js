import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import studentApi from "../../api/studentApi";
import codingExerciseApi from "../../api/codingExerciseApi";
import { FaArrowLeft, FaCode, FaCheckCircle, FaTimesCircle, FaClock, FaExternalLinkAlt } from "react-icons/fa";

export default function CodingExerciseScores() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("scores");
  const [notifications, setNotifications] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await studentApi.getDataStudent();
        setUser(userResponse.data);
        const [exercisesRes, submissionsRes] = await Promise.all([
          codingExerciseApi.getCodingExerciseByClassId(classId),
          studentApi.getSubmissionByStudentIdAndClassId(userResponse.data.studentID, classId)
        ]);
        
        setExercises(exercisesRes.data);
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
  };

  // Lấy bài nộp mới nhất cho mỗi bài tập
  const getLatestSubmissionForExercise = (exerciseId) => {
    const exerciseSubmissions = submissions
      .filter(s => s.exerciseID === exerciseId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    return exerciseSubmissions[0];
  };

  // Chỉ lấy các bài tập đã được nộp ít nhất 1 lần
  const getSubmittedExercises = () => {
    const submittedExerciseIds = [...new Set(submissions.map(s => s.exerciseID))];
    return exercises.filter(ex => submittedExerciseIds.includes(ex.exerciseID));
  };

  const getSubmissionStatus = (submission) => {
    if (!submission) return { text: "Chưa nộp", color: "text-gray-500", icon: <FaTimesCircle /> };
    
    switch (submission.status) {
      case "Accepted":
        return { text: "Hoàn thành", color: "text-green-600", icon: <FaCheckCircle /> };
      case "Failed":
        return { text: "Thất bại", color: "text-red-600", icon: <FaTimesCircle /> };
      case "Đang kiểm tra":
        return { text: "Đang kiểm tra", color: "text-yellow-600", icon: <FaClock /> };
      default:
        return { text: submission.status, color: "text-gray-600", icon: <FaClock /> };
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </main>
    </div>
  );

  const submittedExercises = getSubmittedExercises();
  const totalExercises = exercises.length;
  const completedExercises = new Set(submissions.filter(s => s.status === "Accepted").map(s => s.exerciseID)).size;
  const averageScore = submissions.length > 0 
    ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <main className="flex-1 p-6">
        <Header notifications={notifications} markNotificationAsRead={markNotificationAsRead} />
        
        <section className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <FaCode className="text-blue-500 mr-2" />
                  Kết quả bài tập Coding - Lớp {classId}
                </h2>
              </div>
            </div>
          </div>

          {/* Bảng hiển thị kết quả */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium">
              <div className="col-span-1">STT</div>
              <div className="col-span-5">Bài tập</div>
              <div className="col-span-2">Trạng thái</div>
              <div className="col-span-2">Điểm</div>
              <div className="col-span-2">Hành động</div>
            </div>

            {submittedExercises.map((exercise, index) => {
              const submission = getLatestSubmissionForExercise(exercise.exerciseID);
              const status = getSubmissionStatus(submission);

              return (
                <div 
                  key={exercise.exerciseID} 
                  className={`grid grid-cols-12 p-4 items-center border-b ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-5">
                    <h3 className="font-medium">{exercise.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {exercise.lessonTitle}
                    </p>
                  </div>
                  <div className={`col-span-2 flex items-center ${status.color}`}>
                    <span className="mr-2">{status.icon}</span>
                    {status.text}
                  </div>
                  <div className="col-span-2">
                    {submission ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.score >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {submission.score !== null ? `${submission.score}/100` : 'Đang chấm'}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Link
                      to={`/CodingExercise?exerciseId=${exercise.exerciseID}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                    >
                      <FaExternalLinkAlt className="mr-1" />
                      Xem bài tập
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thống kê tổng quan */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Tổng số bài tập</h3>
              <p className="text-2xl font-bold mt-2">{totalExercises}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Đã hoàn thành</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {completedExercises}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Điểm trung bình</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {averageScore}
              </p>
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