import { useState } from 'react';
import { BsCheckCircleFill, BsExclamationTriangle } from 'react-icons/bs';

export default function SubmitResultModal({ result, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-6 text-center">
          {result.success ? (
            <>
              <BsCheckCircleFill className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Nộp bài thành công!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
                <p className="font-medium">Điểm số: <span className="text-green-600">{result.score}/100</span></p>
                <p>Thời gian: {new Date(result.submissionTime).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <BsExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Nộp bài thất bại</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{result.message}</p>
              </div>
            </>
          )}
          
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-md font-medium ${
              result.success 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}