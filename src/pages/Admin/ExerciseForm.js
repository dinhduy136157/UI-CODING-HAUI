import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/adminApi';

export default function ExerciseForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exampleInput: '',
    exampleOutput: '',
    testCases: [{ inputData: '', expectedOutput: '', isHidden: true }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/exercises/${id}`, formData);
      } else {
        await api.post('/exercises', formData);
      }
      navigate('/admin/exercises');
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        { inputData: '', expectedOutput: '', isHidden: true }
      ]
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = [...formData.testCases];
    newTestCases.splice(index, 1);
    setFormData({ ...formData, testCases: newTestCases });
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Chỉnh sửa' : 'Tạo mới'} Bài tập
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Tiêu đề*</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Mô tả*</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows={5}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Input mẫu</label>
            <textarea
              value={formData.exampleInput}
              onChange={(e) => setFormData({...formData, exampleInput: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Output mẫu</label>
            <textarea
              value={formData.exampleOutput}
              onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium">Test Cases*</label>
            <button
              type="button"
              onClick={addTestCase}
              className="btn-secondary"
            >
              + Thêm Test Case
            </button>
          </div>

          {formData.testCases.map((testCase, index) => (
            <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>Test Case #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="text-red-500"
                >
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Input*</label>
                  <textarea
                    value={testCase.inputData}
                    onChange={(e) => {
                      const newTestCases = [...formData.testCases];
                      newTestCases[index].inputData = e.target.value;
                      setFormData({ ...formData, testCases: newTestCases });
                    }}
                    required
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Output mong đợi*</label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => {
                      const newTestCases = [...formData.testCases];
                      newTestCases[index].expectedOutput = e.target.value;
                      setFormData({ ...formData, testCases: newTestCases });
                    }}
                    required
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              </div>

              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={testCase.isHidden}
                  onChange={(e) => {
                    const newTestCases = [...formData.testCases];
                    newTestCases[index].isHidden = e.target.checked;
                    setFormData({ ...formData, testCases: newTestCases });
                  }}
                  className="mr-2"
                />
                <span className="text-sm">Ẩn test case (hidden test)</span>
              </label>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          {isEditMode ? 'Cập nhật' : 'Tạo'} Bài tập
        </button>
      </div>
    </form>
  );
}