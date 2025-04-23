import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../../api/adminApi';

export default function ExerciseForm() {
  const { id, lessonId } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [currentParam, setCurrentParam] = useState({
    name: '',
    type: ''
  });
  
  const [parameters, setParameters] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exampleInput: '',
    exampleOutput: '',
    lessonId: lessonId,
    functionName: '',
    returnType: '',
    parametersJson: '[]',
    testCases: [{ inputData: '', expectedOutput: '', isHidden: true }]
  });

  // Load data khi ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditMode) {
      const loadExercise = async () => {
        try {
          const response = await adminApi.getExercise(id);
          const data = response.data;
          
          setFormData({
            title: data.title,
            description: data.description,
            exampleInput: data.exampleInput,
            exampleOutput: data.exampleOutput,
            lessonId: data.lessonId,
            functionName: data.functionName,
            returnType: data.returnType,
            parametersJson: data.parametersJson || '[]',
            testCases: data.testCases
          });
          
          if (data.parametersJson) {
            setParameters(JSON.parse(data.parametersJson));
          }
        } catch (error) {
          console.error('Error loading exercise:', error);
        }
      };
      
      loadExercise();
    }
  }, [id, isEditMode]);

  const addParameter = () => {
    if (currentParam.name && currentParam.type) {
      setParameters([...parameters, currentParam]);
      setCurrentParam({ name: '', type: '' });
    }
  };

  const removeParameter = (index) => {
    const newParams = [...parameters];
    newParams.splice(index, 1);
    setParameters(newParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        parametersJson: JSON.stringify(parameters.map(p => ({
          Name: p.name,
          Type: p.type
        })))
      };

      if (isEditMode) {
        await adminApi.updateExercise(id, submitData);
      } else {
        await adminApi.createExercise(submitData);
      }
      navigate(`/admin/lessons/${lessonId}/exercises`);
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Có lỗi xảy ra khi lưu bài tập: ' + (error.response?.data?.message || error.message));
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {isEditMode ? 'Chỉnh sửa' : 'Tạo mới'} Bài tập
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề*</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tiêu đề bài tập"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả*</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả yêu cầu bài tập..."
            />
          </div>
        </div>

        {/* Input/Output mẫu */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Ví dụ mẫu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Input mẫu</label>
              <textarea
                value={formData.exampleInput}
                onChange={(e) => setFormData({...formData, exampleInput: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Nhập input mẫu..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Output mẫu</label>
              <textarea
                value={formData.exampleOutput}
                onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Nhập output mong đợi..."
              />
            </div>
          </div>
        </div>

        {/* Thông tin hàm */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Thông tin hàm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hàm*</label>
              <input
                value={formData.functionName}
                onChange={(e) => setFormData({...formData, functionName: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: sortArray, calculateSum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu trả về*</label>
              <select
                value={formData.returnType}
                onChange={(e) => setFormData({...formData, returnType: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn kiểu trả về --</option>
                <option value="int">int</option>
                <option value="int[]">int[]</option>
                <option value="string">string</option>
                <option value="string[]">string[]</option>
                <option value="boolean">boolean</option>
                <option value="void">void</option>
                <option value="double">double</option>
                <option value="char">char</option>
              </select>
            </div>
          </div>

          {/* Parameters section */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tham số hàm</label>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={currentParam.name}
                onChange={(e) => setCurrentParam({...currentParam, name: e.target.value})}
                placeholder="Tên tham số"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              
              <select
                value={currentParam.type}
                onChange={(e) => setCurrentParam({...currentParam, type: e.target.value})}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn kiểu dữ liệu --</option>
                <option value="int">int</option>
                <option value="int[]">int[]</option>
                <option value="string">string</option>
                <option value="string[]">string[]</option>
                <option value="boolean">boolean</option>
                <option value="double">double</option>
                <option value="char">char</option>
              </select>
              
              <button
                type="button"
                onClick={addParameter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Thêm tham số
              </button>
            </div>
            
            {parameters.length > 0 && (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">Danh sách tham số</div>
                <ul className="divide-y divide-gray-200">
                  {parameters.map((param, index) => (
                    <li key={index} className="px-4 py-2 flex justify-between items-center hover:bg-gray-50">
                      <span className="text-sm">
                        <span className="font-medium">{param.name}</span>: 
                        <span className="text-blue-600 ml-1">{param.type}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeParameter(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        title="Xóa tham số"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Test cases */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">Test Cases*</h2>
            <button
              type="button"
              onClick={addTestCase}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
            >
              + Thêm Test Case
            </button>
          </div>

          <div className="space-y-4">
            {formData.testCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Test Case #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    title="Xóa test case"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Input*</label>
                      <textarea
                        value={testCase.inputData}
                        onChange={(e) => {
                          const newTestCases = [...formData.testCases];
                          newTestCases[index].inputData = e.target.value;
                          setFormData({ ...formData, testCases: newTestCases });
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={3}
                        placeholder="Nhập input..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Output mong đợi*</label>
                      <textarea
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newTestCases = [...formData.testCases];
                          newTestCases[index].expectedOutput = e.target.value;
                          setFormData({ ...formData, testCases: newTestCases });
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={3}
                        placeholder="Nhập output mong đợi..."
                      />
                    </div>
                  </div>

                  <label className="inline-flex items-center mt-3">
                    <input
                      type="checkbox"
                      checked={testCase.isHidden}
                      onChange={(e) => {
                        const newTestCases = [...formData.testCases];
                        newTestCases[index].isHidden = e.target.checked;
                        setFormData({ ...formData, testCases: newTestCases });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ẩn test case (hidden test)</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditMode ? 'Cập nhật bài tập' : 'Tạo bài tập'}
          </button>
        </div>
      </form>
    </div>
  );
}