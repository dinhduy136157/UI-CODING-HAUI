import { FaTachometerAlt, FaCode, FaUsers, FaClipboardCheck, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";

export default function AdminSidebar() {
  const adminMenuItems = [
    { id: "dashboard", icon: <FaTachometerAlt />, label: "Bảng điều khiển", path: "/admin/dashboard" },
    { id: "exercises", icon: <FaCode />, label: "Quản lý bài tập", path: "/admin/exercises" },
    { id: "students", icon: <FaUsers />, label: "Quản lý học sinh", path: "/admin/students" },
    { id: "grading", icon: <FaClipboardCheck />, label: "Chấm điểm", path: "/admin/grading" },
    { id: "classes", icon: <FaCode />, label: "Quản lý lớp học", path: "/admin/classes" },

    { id: "settings", icon: <FaCog />, label: "Cài đặt hệ thống", path: "/admin/settings" }
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <div className="mb-6 flex items-center gap-2">
        <img src={Logo} alt="Logo" className="w-10 h-10" />
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      
      <nav>
        <ul>
          {adminMenuItems.map((tab) => (
            <motion.li
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink
                to={tab.path}
                className={({ isActive }) => 
                  `p-2 flex items-center gap-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                  }`
                }
              >
                {tab.icon} {tab.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}