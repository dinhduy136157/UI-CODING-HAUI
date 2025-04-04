import { useState, useEffect } from 'react';
import { FiUpload, FiFile, FiVideo, FiTrash2, FiPlus } from 'react-icons/fi';
import adminApi from '../../api/adminApi';

const CONTENT_CATEGORIES = [
  "Hoạt động trước khi lên lớp",
  "Hoạt động trên lớp", 
  "Hoạt động sau khi lên lớp"
];

export default function LessonContentManager({ lessonId }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchContents();
  }, [lessonId]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContents(lessonId);
      setContents(res.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedCategory) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('contentType', file.type.includes('pdf') ? 'PDF' : 'Video');
    formData.append('category', selectedCategory);

    try {
      setUploadProgress(0);
      await adminApi.uploadContent(lessonId, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      alert('Tải lên thành công!');
      setFile(null);
      setShowUploadModal(false);
      fetchContents();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Tải lên thất bại');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa nội dung này?')) {
      try {
        await adminApi.deleteContent(contentId);
        fetchContents();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getContentsByCategory = (category) => {
    return contents.filter(content => content.category === category);
  };

  const openUploadModal = (category) => {
    setSelectedCategory(category);
    setShowUploadModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Thêm nội dung {selectedCategory}</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <FiUpload className="text-3xl text-gray-400" />
                <p className="text-gray-600">Chọn file để tải lên</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.mp4,.mov"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Chọn file
                </label>
                {file && (
                  <div className="w-full mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </span>
                      <button
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploadProgress > 0}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
              >
                {uploadProgress > 0 ? `Đang tải lên ${uploadProgress}%` : 'Tải lên'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Content Sections */}
      {!loading && CONTENT_CATEGORIES.map((category) => (
        <div key={category} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{category}</h3>
            <button
              onClick={() => openUploadModal(category)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <FiPlus /> Thêm nội dung
            </button>
          </div>

          {getContentsByCategory(category).length === 0 ? (
            <p className="text-gray-500 text-center py-4">Chưa có nội dung nào</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {getContentsByCategory(category).map((content) => (
                <li key={content.contentID} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {content.contentType === 'PDF' ? (
                        <FiFile className="h-6 w-6 text-red-500" />
                      ) : (
                        <FiVideo className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {content.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {content.contentType}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
                      >
                        Xem
                      </a>
                      <button
                        onClick={() => handleDelete(content.contentID)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}