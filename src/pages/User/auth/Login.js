import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.login(studentId, password);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError("Đăng nhập thất bại!");
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/background_haui.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 shadow-lg rounded-lg p-6">
        {/* Thêm logo phía trên tiêu đề */}
        <div className="flex justify-center mb-4">
          <img 
            src="/Haui-logo.jpg" 
            alt="Logo trường" 
            className="h-20 object-contain" // Điều chỉnh kích thước tại đây
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">
          ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI
        </h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 transition duration-200"
          onClick={handleLogin}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}