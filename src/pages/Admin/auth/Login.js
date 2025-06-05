import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.loginTeacher(email, password);
      localStorage.setItem("token", response.data.token);
      navigate("/admin/classes");
    } catch (err) {
      setError("Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu");
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
            className="h-20 object-contain"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">
          ĐĂNG NHẬP GIẢNG VIÊN
        </h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          placeholder="Email giảng viên"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition duration-200 font-medium shadow-md hover:shadow-lg"
          onClick={handleLogin}
        >
          Đăng nhập
        </button>

        {/* Thêm liên kết hỗ trợ nếu cần */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="#" className="text-orange-600 hover:underline">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}