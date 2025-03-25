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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">
          ĐĂNG NHẬP HỆ THỐNG
        </h2>
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
          className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700"
          onClick={handleLogin}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}