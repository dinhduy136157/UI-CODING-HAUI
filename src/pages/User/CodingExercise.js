import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaPlay, FaSpinner, FaGripLinesVertical, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { BsCheckCircleFill, BsLightbulb, BsCodeSlash, BsExclamationTriangle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import codingExerciseApi from "../../api/codingExerciseApi";
import studentApi from "../../api/studentApi";

const SubmitResultModal = ({ result, onClose }) => {
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
                {result.message && <p className="mt-2">{result.message}</p>}
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
            className={`px-6 py-2 rounded-md font-medium ${result.success
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
};

export default function CodingExercise() {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [user, setUser] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  // Lấy thông tin user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const dataStudent = await studentApi.getDataStudent();
        setUser(dataStudent.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        toast.error("Lỗi khi tải thông tin người dùng");
      }
    };

    fetchUserData();
  }, []);

  // Lấy đề bài
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await codingExerciseApi.getCodingExerciseDetail(exerciseId);
        setExercise(res.data);
        setCode(
          res.data.initialCode ||
          `# ${res.data.description}\n# Input mẫu: ${res.data.exampleInput}\n\n`
        );
      } catch (error) {
        console.error("Lỗi khi lấy đề bài:", error);
        toast.error("Lỗi khi tải đề bài");
      }
    };
    fetchExercise();
  }, [exerciseId]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chạy code");
      return;
    }

    setIsRunning(true);
    setOutput("Đang chạy code...");

    try {
      const res = await codingExerciseApi.submitCode({
        studentId: user.studentID,
        exerciseId: exerciseId,
        code: code,
        language: language,
      });

      console.log("API Response:", res.data);

      if (!res.data.details || !Array.isArray(res.data.details)) {
        throw new Error("Dữ liệu test case không hợp lệ.");
      }

      const apiTestResults = res.data.details;
      const results = exercise.testCases.map((testCase, idx) => {
        const apiResult = idx < apiTestResults.length ? apiTestResults[idx] : null;
        return {
          isCorrect: apiResult?.status === "✅ Pass",
          actualOutput: apiResult?.output || "",
        };
      });

      setTestCaseResults(results);
      setOutput(`✅ ${res.data.passedTestCases}/${res.data.totalTestCases} test cases passed.`);

      if (res.data.passedTestCases === res.data.totalTestCases) {
        toast.success("🎉 Bạn đã pass tất cả test cases! Bây giờ có thể nộp bài.");
      }
    } catch (error) {
      console.error("Lỗi khi submit code:", error);
      if (error.response?.status === 400 && error.response.data?.error) {
        setOutput(`Lỗi biên dịch:\n${error.response.data.error}`);
        toast.error("Lỗi biên dịch code");
      } else {
        setOutput(`Lỗi: ${error.message}`);
        toast.error("Lỗi khi chạy code");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để nộp bài");
      return;
    }

    const allPassed = testCaseResults.length > 0 &&
      testCaseResults.every(result => result.isCorrect);

    if (!allPassed) {
      toast.error("Bạn cần hoàn thành tất cả test cases trước khi nộp!");
      return;
    }

    setIsSubmitting(true);
    setOutput("Đang nộp bài cuối cùng...");

    try {
      const testCasesPassed = testCaseResults.filter(tc => tc.isCorrect).length;
      const totalTestCases = testCaseResults.length;
      const executionTime = Math.max(...testCaseResults.map(tc => tc.executionTime || 0), 0);
      const memoryUsage = Math.max(...testCaseResults.map(tc => tc.memoryUsage || 0), 0);

      // Chuyển kết quả test cases thành JSON
      const formattedResults = testCaseResults.map(tc => ({
        input: tc.input,
        expected: tc.expectedOutput,
        output: tc.actualOutput,
        status: tc.isCorrect ? "✅ Pass" : "❌ Fail"
      }));

      const res = await codingExerciseApi.submitFinalSolution({
        studentId: user.studentID,
        exerciseId: exerciseId,
        code: code,
        language: language,
        result: formattedResults, // ✅ Kết quả chi tiết test case
        score: 100, // Tạm thời 100, nếu có cơ chế chấm điểm khác thì sửa lại
        executionTime: executionTime,
        memoryUsage: memoryUsage,
        testCasesPassed: testCasesPassed,
        totalTestCases: totalTestCases
      });

      setSubmitResult({
        success: true,
        score: 100,
        submissionTime: new Date(),
        message: "Nộp bài thành công"
      });

      toast.success("🎉 Bài làm đã được ghi nhận!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Lỗi hệ thống";
      setSubmitResult({
        success: false,
        message: errorMsg
      });
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, 20));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 12));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Thông báo cần pass hết test cases */}
        {testCaseResults.length > 0 && !testCaseResults.every(result => result.isCorrect) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <BsExclamationTriangle className="flex-shrink-0 h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-yellow-700">
                  Bạn cần pass tất cả test cases trước khi có thể nộp bài cuối cùng.
                </p>
              </div>
            </div>
          </div>
        )}

        <PanelGroup
          direction="horizontal"
          className={`flex-1 bg-white ${isFullScreen ? "fixed inset-0 z-50 mt-0" : ""}`}
        >
          {/* Panel bên trái - Bài tập */}
          {!isFullScreen && (
            <>
              <Panel defaultSize={40} minSize={25} className="bg-white shadow-sm">
                <div className="h-full overflow-auto">
                  {/* Header bài tập */}
                  <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h1 className="text-xl font-semibold text-gray-800">
                        {exercise?.title || "Đang tải..."}
                      </h1>
                      <button
                        onClick={toggleFullScreen}
                        className="text-gray-500 hover:text-blue-600 p-1 rounded-md"
                        title="Toàn màn hình"
                      >
                        <FaExpandAlt size={14} />
                      </button>
                    </div>
                    <div className="flex mt-3 space-x-2">
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`px-3 py-1 text-sm rounded-md flex items-center ${activeTab === "description"
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <BsCodeSlash className="mr-2" />
                        Mô tả
                      </button>
                      <button
                        onClick={() => setActiveTab("solutions")}
                        className={`px-3 py-1 text-sm rounded-md flex items-center ${activeTab === "solutions"
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <BsLightbulb className="mr-2" />
                        Giải pháp
                      </button>
                    </div>
                  </div>

                  {/* Nội dung bài tập */}
                  <div className="p-6">
                    {activeTab === "description" && exercise && (
                      <>
                        <div className="prose max-w-none mb-6 text-gray-800">
                          <p className="whitespace-pre-line">{exercise.description}</p>
                        </div>

                        {/* Ví dụ */}
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <BsLightbulb className="mr-2 text-yellow-500 text-lg" />
                            <h3 className="font-medium text-lg text-gray-800">Ví dụ</h3>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                            <div>
                              <p className="text-sm text-gray-500 mb-1 font-medium">Input:</p>
                              <pre className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                                {exercise.exampleInput}
                              </pre>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1 font-medium">Output:</p>
                              <pre className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                                {exercise.exampleOutput}
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* Test cases */}
                        <div>
                          <h3 className="font-medium text-lg mb-3 text-gray-800">Test Cases</h3>

                          {/* Tab chọn test case */}
                          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                            {exercise.testCases?.filter(tc => !tc.isHidden).map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentTestCaseIndex(idx)}
                                className={`px-3 py-1 text-sm rounded-md flex items-center min-w-max ${currentTestCaseIndex === idx
                                    ? "bg-blue-100 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                  }`}
                              >
                                {testCaseResults[idx]?.isCorrect !== undefined ? (
                                  testCaseResults[idx].isCorrect ? (
                                    <BsCheckCircleFill className="mr-2 text-green-500" />
                                  ) : (
                                    <IoMdClose className="mr-2 text-red-500" />
                                  )
                                ) : (
                                  <BsCheckCircleFill className="mr-2 text-gray-300" />
                                )}
                                Test case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Nội dung test case hiện tại */}
                          {exercise.testCases?.filter(tc => !tc.isHidden).map((testCase, idx) => (
                            <div
                              key={idx}
                              className={`mb-4 last:mb-0 ${currentTestCaseIndex === idx ? 'block' : 'hidden'
                                }`}
                            >
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1 font-medium">Input:</p>
                                  <pre className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                                    {testCase.inputData}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1 font-medium">Expected output:</p>
                                  <pre className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                                    {testCase.expectedOutput}
                                  </pre>
                                </div>
                                {testCaseResults[idx] && (
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1 font-medium">Your output:</p>
                                    <pre
                                      className={`p-3 rounded text-sm font-mono overflow-x-auto ${testCaseResults[idx].isCorrect
                                          ? "bg-green-50 text-green-800 border border-green-200"
                                          : "bg-red-50 text-red-800 border border-red-200"
                                        }`}
                                    >
                                      {testCaseResults[idx].actualOutput}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {activeTab === "solutions" && (
                      <div className="text-center py-10 text-gray-500">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 inline-block">
                          <BsLightbulb className="mx-auto text-2xl text-yellow-400 mb-3" />
                          <p className="text-gray-600">Tính năng đang được phát triển</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              {/* Handle kéo thả */}
              <PanelResizeHandle className="w-2 bg-gray-100 hover:bg-blue-400 transition-colors relative group">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600">
                  <FaGripLinesVertical />
                </div>
              </PanelResizeHandle>
            </>
          )}

          {/* Panel bên phải - Code Editor */}
          <Panel defaultSize={isFullScreen ? 100 : 60} minSize={40} className="bg-gray-50 border-l">
            <div className="h-full flex flex-col">
              {/* Thanh công cụ */}
              <div className="bg-white border-b p-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm py-1 px-3 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="python">Python</option>
                    <option value="csharp">C#</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                  </select>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <button
                      onClick={decreaseFontSize}
                      className="px-2 py-1 rounded hover:bg-gray-100"
                      title="Giảm cỡ chữ"
                    >
                      A-
                    </button>
                    <span className="text-xs">{fontSize}px</span>
                    <button
                      onClick={increaseFontSize}
                      className="px-2 py-1 rounded hover:bg-gray-100"
                      title="Tăng cỡ chữ"
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isFullScreen && (
                    <button
                      onClick={toggleFullScreen}
                      className="text-gray-500 hover:text-blue-600 p-1 rounded-md"
                      title="Thoát toàn màn hình"
                    >
                      <FaCompressAlt size={14} />
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                    className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm ${isRunning || isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                      } text-white shadow-sm transition-colors`}
                  >
                    {isRunning ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Đang chạy
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        Chạy code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={
                      isSubmitting ||
                      isRunning ||
                      !testCaseResults.length ||
                      !testCaseResults.every(result => result.isCorrect)
                    }
                    className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm ${isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : testCaseResults.every(result => result.isCorrect)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-white shadow-sm transition-colors`}
                    title={
                      testCaseResults.every(result => result.isCorrect)
                        ? "Nộp bài cuối cùng"
                        : "Bạn cần pass tất cả test cases trước khi nộp"
                    }
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <BsCheckCircleFill />
                    )}
                    Nộp bài
                  </button>
                </div>
              </div>

              {/* Editor và Output với khả năng resize */}
              <PanelGroup direction="vertical" className="flex-1">
                <Panel defaultSize={70} minSize={30} className="relative">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={setCode}
                    options={{
                      minimap: { enabled: false },
                      fontSize: fontSize,
                      scrollBeyondLastLine: false,
                      padding: { top: 15 },
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                  />
                </Panel>

                <PanelResizeHandle className="h-2 bg-gray-100 hover:bg-blue-400 transition-colors relative group">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600">
                    <FaGripLinesVertical className="rotate-90" />
                  </div>
                </PanelResizeHandle>

                <Panel defaultSize={30} minSize={15} className="bg-[#1e1e1e] flex flex-col">
                  <div className="flex justify-between items-center p-3 border-b border-gray-700">
                    <h3 className="font-medium text-sm text-gray-300">Kết quả</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setOutput("")}
                        className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
                        title="Xóa hết"
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  </div>
                  <pre className="flex-1 overflow-auto p-3 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {output || "// Kết quả sẽ hiển thị ở đây sau khi chạy code"}
                  </pre>
                </Panel>
              </PanelGroup>
            </div>
          </Panel>
        </PanelGroup>
      </main>

      {/* Modal hiển thị kết quả nộp bài */}
      {submitResult && (
        <SubmitResultModal
          result={submitResult}
          onClose={() => setSubmitResult(null)}
        />
      )}
    </div>
  );
}