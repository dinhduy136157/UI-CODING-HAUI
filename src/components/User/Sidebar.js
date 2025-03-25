import { FaHome, FaTachometerAlt, FaCalendarAlt, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../../assets/images/Logo.png";

export default function Sidebar({ selectedTab, setSelectedTab }) {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <div className="mb-6 flex items-center gap-2">
      <img src={Logo} alt="Logo" className="w-10 h-10" />
      <h2 className="text-lg font-semibold">Trang chủ</h2>
      </div>
      <nav>
        <ul>
          {[
            { id: "dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
            { id: "pages", icon: <FaHome />, label: "Các trang của hệ thống" },
            { id: "courses", icon: <FaBook />, label: "Các khóa học của tôi" },
            { id: "events", icon: <FaCalendarAlt />, label: "Các sự kiện" },
          ].map((tab) => (
            <motion.li
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 flex items-center gap-2 cursor-pointer rounded-md transition-colors ${
                selectedTab === tab.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </motion.li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}