import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { useState, useEffect } from 'react';


export default function ClassDetail() {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    adminApi.getClassDetail(classId).then(res => setClassInfo(res.data));
    adminApi.getLessons(classId).then(res => setLessons(res.data));
  }, [classId]);

  return (
    <div>
      <h1>{classInfo?.className}</h1>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Danh sách Bài học</h2>
        {lessons.map(lesson => (
          <Link 
            key={lesson.lessonID}
            to={`/admin/lessons/${lesson.lessonID}`}
            className="block p-4 border-b hover:bg-gray-50"
          >
            {lesson.lessonTitle}
          </Link>
        ))}
      </div>
    </div>
  );
}