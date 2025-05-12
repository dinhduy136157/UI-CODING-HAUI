import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";
import authApi from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Header({ notifications = [], markNotificationAsRead }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await studentApi.getDataStudent();
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login"); // Điều hướng về trang login sau khi đăng xuất
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md rounded-md">
      <h1 className="text-xl font-semibold">Trang chủ</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle className="text-2xl" />
            <span className="font-semibold">
              {user ? user.fullName : "Đang tải..."}
            </span>
          </div>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-10">
              <div
                className="flex items-center gap-2 p-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}