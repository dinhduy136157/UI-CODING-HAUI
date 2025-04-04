import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentManager from './LessonContentManager';
import CodingExercisePage from './Exercises';

export default function LessonDetail() {
  const { lessonId } = useParams();
  const [activeTab, setActiveTab] = useState('content'); // 'content' hoặc 'exercises'

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Nội dung bài học
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'exercises'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('exercises')}
        >
          Bài tập thực hành
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'content' && <ContentManager lessonId={lessonId} />}
        {activeTab === 'exercises' && <CodingExercisePage lessonId={lessonId} />}
      </div>
    </div>
  );
}