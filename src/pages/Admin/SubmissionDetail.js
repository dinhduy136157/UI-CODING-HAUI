import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/adminApi';
import { CodeBlock, dracula } from 'react-code-blocks';

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

  const parseTestCases = (result) => {
    try {
      return JSON.parse(result);
    } catch (e) {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin bài nộp...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy bài nộp</h3>
          <p className="mt-1 text-gray-500">Bài nộp bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const testCases = parseTestCases(submission.result);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết bài nộp</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
            {submission.status}
          </span>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Tổng quan</h2>
                <p className="text-sm text-gray-500">Thông tin cơ bản về bài nộp</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {submission.score}<span className="text-xl text-gray-500">/100</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Ngôn ngữ</h3>
                <p className="mt-1 text-lg font-medium">{submission.programmingLanguage}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Test cases</h3>
                <p className="mt-1 text-lg font-medium">
                  {submission.testCasesPassed}/{submission.totalTestCases}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${(submission.testCasesPassed / submission.totalTestCases) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Thời gian nộp</h3>
                <p className="mt-1 text-lg font-medium">
                  {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mã nguồn</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {submission.programmingLanguage}
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <CodeBlock
                text={submission.code}
                language={submission.programmingLanguage.toLowerCase()}
                showLineNumbers={true}
                theme={dracula}
                wrapLines
              />
            </div>
          </div>
        </div>

        {/* Test Cases Section */}
        {testCases.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kết quả test cases</h2>
              
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg overflow-hidden ${testCase.status.includes('Pass') ? 'border-green-200' : 'border-red-200'}`}
                  >
                    <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                      <h3 className="font-medium">Test case #{index + 1}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testCase.status.includes('Pass') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {testCase.status}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Input</h4>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <pre className="text-sm overflow-x-auto">{testCase.input || 'Không có input'}</pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Expected</h4>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <pre className="text-sm overflow-x-auto">{testCase.expected}</pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Output</h4>
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <pre className="text-sm overflow-x-auto">{testCase.output}</pre>
                          </div>
                        </div>
                      </div>
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