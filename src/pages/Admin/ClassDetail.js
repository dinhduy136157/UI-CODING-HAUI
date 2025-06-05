import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { useState, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

export default function ClassDetail() {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonContents, setLessonContents] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch class info
        const classResponse = await adminApi.getClassDetail(classId);
        setClassInfo(classResponse.data);

        // 2. Fetch lessons
        const lessonsResponse = await adminApi.getLessons(classId);
        setLessons(lessonsResponse.data);

        // 3. Fetch contents for each lesson
        const contents = {};
        for (const lesson of lessonsResponse.data) {
          const contentResponse = await adminApi.getContents(lesson.lessonID);
          contents[lesson.lessonID] = contentResponse.data;
        }
        setLessonContents(contents);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [classId]);

  // Hàm đếm số lượng tài liệu dựa trên lessonContents
  const countDocuments = (lessonId) => {
    if (!lessonContents[lessonId]) return 0;
    
    return lessonContents[lessonId].reduce((count, content) => {
      const isDocument = content.contentType === "PDF" || content.contentType === "Slide";
      return count + (isDocument ? 1 : 0);
    }, 0);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{classInfo?.className}</h1>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <FaBook className="mr-2 text-blue-500" />
          Danh sách Bài học
        </h2>
        
        <div className="space-y-4">
          {lessons.map(lesson => (
            <Link 
              key={lesson.lessonID}
              to={`/admin/lessons/${lesson.lessonID}`}
              className="block group transition-all"
            >
              <div className="flex items-start p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaBook className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lesson.lessonTitle}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaFileAlt className="mr-1" />
                      {countDocuments(lesson.lessonID)} tài liệu
                    </span>
                  </div>
                </div>
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}