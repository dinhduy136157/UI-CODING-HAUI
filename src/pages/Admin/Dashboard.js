import { useState, useEffect } from 'react';
import { 
  FaCode, 
  FaUsers, 
  FaFileUpload, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaChartLine,
  FaLanguage,
  FaTachometerAlt,
  FaGraduationCap,
  FaBook
} from 'react-icons/fa';
import adminApi from '../../api/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalExercises: 0,
    totalSubmissions: 0,
    totalStudents: 0,
    totalClasses: 0,
    averageScore: 0,
    passRate: 0,
    averageExecutionTime: 0,
    popularLanguages: []
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseStats, setExerciseStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Lấy dữ liệu song song
        const [classesRes, exercisesRes, submissionsRes] = await Promise.all([
          adminApi.getClasses(),
          adminApi.getAllExercise(),
          adminApi.getAllSubmissions()
        ]);

        // Tính toán thống kê tổng quan
        const totalStudents = classesRes.data.reduce((sum, classItem) => {
          return sum + (classItem.studentCount || 0);
        }, 0);

        const submissions = submissionsRes.data;
        const exercises = exercisesRes.data;
        
        // Tính điểm trung bình và tỷ lệ pass
        const totalScore = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
        const averageScore = submissions.length > 0 ? (totalScore / submissions.length).toFixed(1) : 0;
        const passCount = submissions.filter(sub => sub.status === "Accepted").length;
        const passRate = submissions.length > 0 ? ((passCount / submissions.length) * 100).toFixed(1) : 0;

        // Tính thời gian thực thi trung bình
        const totalExecutionTime = submissions.reduce((sum, sub) => sum + (sub.executionTime || 0), 0);
        const averageExecutionTime = submissions.length > 0 ? (totalExecutionTime / submissions.length).toFixed(2) : 0;

        // Thống kê ngôn ngữ lập trình phổ biến
        const languageCount = submissions.reduce((acc, sub) => {
          acc[sub.programmingLanguage] = (acc[sub.programmingLanguage] || 0) + 1;
          return acc;
        }, {});
        
        const popularLanguages = Object.entries(languageCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([lang, count]) => ({
            language: lang,
            count: count,
            percentage: ((count / submissions.length) * 100).toFixed(1)
          }));

        setStats({
          totalExercises: exercises.length,
          totalSubmissions: submissions.length,
          totalStudents: totalStudents,
          totalClasses: classesRes.data.length,
          averageScore: averageScore,
          passRate: passRate,
          averageExecutionTime: averageExecutionTime,
          popularLanguages: popularLanguages
        });
        
        // Lấy 5 bài nộp gần nhất với thông tin chi tiết hơn
        const sortedSubmissions = submissions
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 5);
        
        setRecentSubmissions(sortedSubmissions);
        setClasses(classesRes.data.slice(0, 3));
        setExercises(exercises);

        // Nếu có bài tập, chọn bài tập đầu tiên để hiển thị thống kê
        if (exercises.length > 0) {
          setSelectedExercise(exercises[0]);
          calculateExerciseStats(exercises[0], submissions);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateExerciseStats = (exercise, allSubmissions) => {
    const exerciseSubmissions = allSubmissions.filter(sub => sub.exerciseID === exercise.exerciseID);
    
    const stats = {
      totalSubmissions: exerciseSubmissions.length,
      passRate: exerciseSubmissions.length > 0 
        ? ((exerciseSubmissions.filter(sub => sub.status === "Accepted").length / exerciseSubmissions.length) * 100).toFixed(1)
        : 0,
      averageScore: exerciseSubmissions.length > 0
        ? (exerciseSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / exerciseSubmissions.length).toFixed(1)
        : 0,
      averageExecutionTime: exerciseSubmissions.length > 0
        ? (exerciseSubmissions.reduce((sum, sub) => sum + (sub.executionTime || 0), 0) / exerciseSubmissions.length).toFixed(2)
        : 0,
      languageDistribution: exerciseSubmissions.reduce((acc, sub) => {
        acc[sub.programmingLanguage] = (acc[sub.programmingLanguage] || 0) + 1;
        return acc;
      }, {}),
      recentSubmissions: exerciseSubmissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5)
    };

    setExerciseStats(stats);
  };

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
    calculateExerciseStats(exercise, recentSubmissions);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-100";
      case "Wrong Answer":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Lỗi khi tải dữ liệu: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaGraduationCap className="mr-2 text-blue-600" />
          Bảng điều khiển
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaBook className="text-blue-500" />}
          title="Tổng bài tập"
          value={stats.totalExercises}
          color="blue"
        />
        <StatCard 
          icon={<FaUsers className="text-green-500" />}
          title="Tổng học sinh"
          value={stats.totalStudents}
          color="green"
        />
        <StatCard 
          icon={<FaCheckCircle className="text-yellow-500" />}
          title="Tỷ lệ pass trung bình"
          value={`${stats.passRate}%`}
          color="yellow"
        />
        <StatCard 
          icon={<FaTachometerAlt className="text-purple-500" />}
          title="Thời gian thực thi TB"
          value={`${stats.averageExecutionTime}ms`}
          color="purple"
        />
      </div>

      {/* Exercise Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Thống kê theo bài tập</h2>
        
        {/* Exercise Selector */}
        <div className="mb-6">
          <select 
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedExercise?.exerciseID}
            onChange={(e) => {
              const exercise = exercises.find(ex => ex.exerciseID === parseInt(e.target.value));
              handleExerciseChange(exercise);
            }}
          >
            {exercises.map(exercise => (
              <option key={exercise.exerciseID} value={exercise.exerciseID}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>

        {exerciseStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<FaFileUpload className="text-blue-500" />}
              title="Số lần nộp"
              value={exerciseStats.totalSubmissions}
              color="blue"
            />
            <StatCard 
              icon={<FaCheckCircle className="text-green-500" />}
              title="Tỷ lệ pass"
              value={`${exerciseStats.passRate}%`}
              color="green"
            />
            <StatCard 
              icon={<FaChartLine className="text-yellow-500" />}
              title="Điểm trung bình"
              value={exerciseStats.averageScore}
              color="yellow"
            />
            <StatCard 
              icon={<FaClock className="text-purple-500" />}
              title="Thời gian thực thi TB"
              value={`${exerciseStats.averageExecutionTime}ms`}
              color="purple"
            />
          </div>
        )}

        {/* Language Distribution */}
        {exerciseStats && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Phân bố ngôn ngữ lập trình</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(exerciseStats.languageDistribution).map(([lang, count]) => (
                <div key={lang} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lang}</span>
                    <span className="text-sm text-gray-500">{count} bài nộp</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / exerciseStats.totalSubmissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Submissions for Selected Exercise */}
        {exerciseStats && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Bài nộp gần đây</h3>
            <div className="space-y-4">
              {exerciseStats.recentSubmissions.map((submission) => (
                <div 
                  key={submission.submissionID} 
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Học sinh #{submission.studentID}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Ngôn ngữ: {submission.programmingLanguage}</p>
                      <p>Thời gian: {new Date(submission.submittedAt).toLocaleString()}</p>
                      <p>Test cases: {submission.testCasesPassed}/{submission.totalTestCases}</p>
                      {submission.executionTime > 0 && (
                        <p>Thời gian thực thi: {submission.executionTime}ms</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Submissions Across All Exercises */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Bài nộp gần đây (Tất cả bài tập)</h2>
        <div className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div 
              key={submission.submissionID} 
              className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Bài tập #{submission.exerciseID}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Học sinh #{submission.studentID}</p>
                  <p>Ngôn ngữ: {submission.programmingLanguage}</p>
                  <p>Thời gian: {new Date(submission.submittedAt).toLocaleString()}</p>
                  <p>Test cases: {submission.testCasesPassed}/{submission.totalTestCases}</p>
                  {submission.executionTime > 0 && (
                    <p>Thời gian thực thi: {submission.executionTime}ms</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-800',
    green: 'bg-green-50 text-green-800',
    purple: 'bg-purple-50 text-purple-800',
    yellow: 'bg-yellow-50 text-yellow-800'
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-xl`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-white bg-opacity-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}