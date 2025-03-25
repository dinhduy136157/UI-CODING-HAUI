import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { FaPlay, FaCheck, FaSpinner } from "react-icons/fa";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import codingExerciseApi from "../../api/codingExerciseApi";

export default function CodingExercise() {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const lessonId = searchParams.get("lessonId");
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Lấy đề bài
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await codingExerciseApi.getExerciseDetail(exerciseId);
        setExercise(res.data);
        setCode(res.data.initialCode || `# ${res.data.description}\n# Input mẫu: ${res.data.exampleInput}\n\n`);
      } catch (error) {
        console.error("Lỗi khi lấy đề bài:", error);
      }
    };
    fetchExercise();
  }, [exerciseId]);

  // Xử lý submit code
  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      const res = await codingExerciseApi.submitCode({
        exerciseId,
        lessonId,
        code,
        language
      });
      setOutput(res.data.result);
    } catch (error) {
      setOutput(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!exercise) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Bài tập */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4 text-blue-800">{exercise.title}</h1>
            <div className="prose max-w-none mb-6">
              <p>{exercise.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-semibold mb-2">📌 Ví dụ:</h3>
                <p>Input: <code>{exercise.exampleInput}</code></p>
                <p>Output: <code>{exercise.exampleOutput}</code></p>
              </div>
              
              {exercise.testCases?.filter(tc => !tc.isHidden).map((testCase, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="font-semibold mb-2">Test case #{idx + 1}</h3>
                  <p>Input: <code>{testCase.inputData}</code></p>
                  <p>Expected: <code>{testCase.expectedOutput}</code></p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex-1 p-2 border rounded bg-white"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
              </select>
              
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  isRunning 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {isRunning ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Đang chạy...
                  </>
                ) : (
                  <>
                    <FaPlay />
                    Chạy code
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden">
              <Editor
                height="60vh"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Output */}
            <div className="bg-black text-white p-4 rounded-lg font-mono text-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Kết quả</h3>
                <button 
                  onClick={() => setOutput("")}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <pre className="overflow-auto max-h-40">
                {output || "Chạy code để xem kết quả..."}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}