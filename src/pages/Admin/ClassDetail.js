import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { useState, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

export default function ClassDetail() {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    adminApi.getClassDetail(classId).then(res => setClassInfo(res.data));
    adminApi.getLessons(classId).then(res => setLessons(res.data));
  }, [classId]);

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
                      {lesson.contents?.length || 0} tài liệu
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