import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FaPlay, FaSpinner, FaGripLinesVertical, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { BsCheckCircleFill, BsLightbulb, BsCodeSlash } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Sidebar from "../../components/User/Sidebar";
import Header from "../../components/User/Header";
import codingExerciseApi from "../../api/codingExerciseApi";

export default function CodingExercise() {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // Lấy đề bài
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const res = await codingExerciseApi.getCodingExerciseDetail(exerciseId);
        setExercise(res.data);
        setCode(res.data.initialCode || `# ${res.data.description}\n# Input mẫu: ${res.data.exampleInput}\n\n`);
      } catch (error) {
        console.error("Lỗi khi lấy đề bài:", error);
      }
    };
    fetchExercise();
  }, [exerciseId]);

  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput("Đang chạy code...");
    try {
      const res = await codingExerciseApi.submitCode({
        exerciseId,
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
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
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
                        className={`px-3 py-1 text-sm rounded-md flex items-center ${
                          activeTab === "description" 
                            ? "bg-blue-100 text-blue-600 font-medium" 
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <BsCodeSlash className="mr-2" />
                        Mô tả
                      </button>
                      <button
                        onClick={() => setActiveTab("solutions")}
                        className={`px-3 py-1 text-sm rounded-md flex items-center ${
                          activeTab === "solutions" 
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
                          {exercise.testCases?.filter(tc => !tc.isHidden).map((testCase, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                              <div className="flex items-center mb-2">
                                <BsCheckCircleFill className="mr-2 text-green-500" />
                                <span className="font-medium text-gray-700">Test case {idx + 1}</span>
                              </div>
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
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
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
                    disabled={isRunning}
                    className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm ${
                      isRunning 
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
    </div>
  );
}