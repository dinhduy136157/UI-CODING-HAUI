import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/adminApi';

export default function SubmissionDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      const submissionId = params.submissionId;
      
      if (!submissionId) {
        console.error('No submission ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getSubmissionById(submissionId);
        setSubmission(response.data);
      } catch (error) {
        console.error('Error fetching submission:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmission();
  }, [params.submissionId]);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatExecutionTime = (time) => {
    return `${time}ms`;
  };

  const formatMemoryUsage = (memory) => {
    return `${memory}KB`;
  };

  const parseTestCases = (result) => {
    try {
      return JSON.parse(result);
    } catch (e) {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin bài nộp</p>
      </div>
    );
  }

  const testCases = parseTestCases(submission.result);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài nộp</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin bài nộp */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bài nộp</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Điểm:</span>
                  <span className="font-medium">{submission.score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngôn ngữ:</span>
                  <span className="font-medium">{submission.programmingLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian thực thi:</span>
                  <span className="font-medium">{formatExecutionTime(submission.executionTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bộ nhớ sử dụng:</span>
                  <span className="font-medium">{formatMemoryUsage(submission.memoryUsage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Test cases:</span>
                  <span className="font-medium">{submission.testCasesPassed}/{submission.totalTestCases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian nộp:</span>
                  <span className="font-medium">{new Date(submission.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Code</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>{submission.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases Results */}
        {testCases.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Kết quả test cases</h2>
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Input</h3>
                        <pre className="text-sm bg-gray-50 p-2 rounded">
                          {testCase.input}
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Expected Output</h3>
                        <pre className="text-sm bg-gray-50 p-2 rounded">
                          {testCase.expected}
                        </pre>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Actual Output</h3>
                      <pre className="text-sm bg-gray-50 p-2 rounded">
                        {testCase.output}
                      </pre>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testCase.status.includes('Pass') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testCase.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
