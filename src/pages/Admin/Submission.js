import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/adminApi';

export default function Submissions() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get(`/exercises/${id}/submissions`);
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [id]);

  const updateScore = async (submissionId, score) => {
    try {
      await api.patch(`/submissions/${submissionId}`, { score });
      setSubmissions(submissions.map(sub => 
        sub.submissionID === submissionId ? { ...sub, score } : sub
      ));
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Danh sách bài nộp</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Học sinh</th>
                <th className="py-2 px-4">Ngày nộp</th>
                <th className="py-2 px-4">Trạng thái</th>
                <th className="py-2 px-4">Test cases</th>
                <th className="py-2 px-4">Điểm</th>
                <th className="py-2 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.submissionID} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{sub.student.fullName}</td>
                  <td className="py-2 px-4">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`badge-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {sub.testCasesPassed}/{sub.totalTestCases}
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={sub.score || ''}
                      onChange={(e) => updateScore(sub.submissionID, parseInt(e.target.value))}
                      min="0"
                      max="100"
                      className="w-16 p-1 border rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button className="btn-secondary">
                      Xem code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}