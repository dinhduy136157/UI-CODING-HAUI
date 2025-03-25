import { FaBell, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import studentApi from "../../api/studentApi";


export default function Header({notifications = [], markNotificationAsRead }) {
  const [user, setUser] = useState(null); // State lưu thông tin user

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
  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md rounded-md">
      <h1 className="text-xl font-semibold">Trang chủ</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell className="cursor-pointer" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">!</span>
          )}
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 text-sm ${n.read ? "text-gray-400" : "text-gray-800"} cursor-pointer hover:bg-gray-100`}
                onClick={() => markNotificationAsRead(n.id)}
              >
                {n.message}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl" />

          <span className="font-semibold">{user ? user.fullName : "Đang tải..."}</span>
        </div>
      </div>
    </header>
  );
}
